const SHEET_NAME = 'Inscripciones';
const PAYMENT_FOLDER_NAME = 'Comprobantes Torneo STEAM LUVÁ 2026';
const MAX_PAYMENT_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_PAYMENT_MIME_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
const SHARE_PAYMENT_RECEIPTS_WITH_LINK = true;
const REGISTRATION_HEADERS = [
  'Fecha',
  'ID',
  'Proyecto/Equipo',
  'Categoría',
  'Nivel',
  'Institución',
  'Provincia',
  'Distrito',
  'Director(a)',
  'Correo institución',
  'Asesor(a)',
  'Rol',
  'Género asesor(a)',
  'Correo asesor(a)',
  'Teléfono',
  'Estudiantes',
  'Observaciones',
  'Archivo comprobante',
  'URL comprobante'
];

function doPost(e) {
  const lock = LockService.getScriptLock();

  try {
    lock.waitLock(10000);
    const data = JSON.parse(e.parameter.payload || '{}');
    validateRegistration(data);

    const registrationId = Utilities.getUuid();
    const paymentFile = savePaymentReceipt(data.comprobantePago, registrationId, data.nombreProyecto);
    const paymentUrl = paymentFile.getUrl();
    const sheet = getRegistrationSheet();
    const students = data.integrantes.map(function (student, index) {
      return `${index + 1}. ${student.nombre} | ${student.edad} años | ${student.correo} | ${student.genero}`;
    }).join('\n');

    sheet.appendRow([
      new Date(),
      registrationId,
      data.nombreProyecto,
      data.categoria,
      data.nivelEscolar,
      data.institucion,
      data.provincia,
      data.distrito,
      data.nombreDirector,
      data.emailInstitucion,
      data.nombreAsesor,
      data.rolAsesor,
      data.generoAsesor,
      data.correoAsesor,
      data.telefonoAsesor,
      students,
      data.observaciones || '',
      paymentFile.getName(),
      'Ver comprobante'
    ]);

    const lastRow = sheet.getLastRow();
    sheet.getRange(lastRow, 19).setRichTextValue(
      SpreadsheetApp.newRichTextValue()
        .setText('Ver comprobante')
        .setLinkUrl(paymentUrl)
        .build()
    );

    sendConfirmationEmail(data, registrationId);
    return jsonResponse({ ok: true, registrationId: registrationId });
  } catch (error) {
    console.error(error);
    return jsonResponse({ ok: false, error: error.message });
  } finally {
    lock.releaseLock();
  }
}

function getRegistrationSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
  }

  ensureRegistrationHeaders(sheet);
  return sheet;
}

function ensureRegistrationHeaders(sheet) {
  const firstRow = sheet.getRange(1, 1, 1, REGISTRATION_HEADERS.length).getValues()[0];
  const needsHeaders = REGISTRATION_HEADERS.some(function (header, index) {
    return firstRow[index] !== header;
  });

  if (needsHeaders) {
    sheet.getRange(1, 1, 1, REGISTRATION_HEADERS.length).setValues([REGISTRATION_HEADERS]);
  }

  sheet.setFrozenRows(1);
}

function validateRegistration(data) {
  const required = [
    'nombreProyecto',
    'categoria',
    'nivelEscolar',
    'institucion',
    'provincia',
    'distrito',
    'nombreDirector',
    'emailInstitucion',
    'nombreAsesor',
    'rolAsesor',
    'generoAsesor',
    'correoAsesor',
    'telefonoAsesor'
  ];

  required.forEach(function (field) {
    if (!String(data[field] || '').trim()) throw new Error(`Falta el campo ${field}.`);
  });

  if (!data.terminos) throw new Error('Se deben aceptar los términos.');
  if (!Array.isArray(data.integrantes) || data.integrantes.length < 1 || data.integrantes.length > 3) {
    throw new Error('La inscripción debe incluir entre 1 y 3 estudiantes.');
  }

  data.integrantes.forEach(function (student, index) {
    ['nombre', 'edad', 'correo', 'genero'].forEach(function (field) {
      if (!String(student[field] || '').trim()) {
        throw new Error(`Falta el campo ${field} del estudiante ${index + 1}.`);
      }
    });
  });

  validatePaymentReceipt(data.comprobantePago);
}

function validatePaymentReceipt(file) {
  if (!file || !file.base64) throw new Error('El comprobante de pago es requerido.');
  if (!file.name) throw new Error('El comprobante debe tener nombre de archivo.');
  if (Number(file.size || 0) > MAX_PAYMENT_FILE_SIZE) throw new Error('El comprobante no puede pesar más de 5 MB.');
  if (ALLOWED_PAYMENT_MIME_TYPES.indexOf(file.type) === -1) {
    throw new Error('El comprobante debe ser PDF, JPG, PNG o WebP.');
  }
}

function savePaymentReceipt(file, registrationId, projectName) {
  const folder = getOrCreateFolder(PAYMENT_FOLDER_NAME);
  const bytes = Utilities.base64Decode(file.base64);
  const extension = getFileExtension(file.name);
  const safeProjectName = sanitizeFileName(projectName).slice(0, 60);
  const fileName = `${registrationId}-${safeProjectName}${extension}`;
  const blob = Utilities.newBlob(bytes, file.type, fileName);

  const savedFile = folder.createFile(blob);

  if (SHARE_PAYMENT_RECEIPTS_WITH_LINK) {
    savedFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  }

  return savedFile;
}

function getOrCreateFolder(folderName) {
  const folders = DriveApp.getFoldersByName(folderName);
  if (folders.hasNext()) return folders.next();
  return DriveApp.createFolder(folderName);
}

function getFileExtension(fileName) {
  const match = String(fileName || '').match(/\.[a-zA-Z0-9]+$/);
  return match ? match[0].toLowerCase() : '';
}

function sanitizeFileName(value) {
  return String(value || 'proyecto')
    .replace(/[\\/:*?"<>|#%{}~&]/g, '-')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || 'proyecto';
}

function sendConfirmationEmail(data, registrationId) {
  const subject = `Confirmación de inscripción | Torneo STEAM LUVÁ 2026`;
  const categoryLabel = getCategoryLabel(data.categoria);
  const studentList = data.integrantes.map(function (student) {
    return `<li>${escapeHtml(student.nombre)} · ${escapeHtml(student.edad)} años · ${escapeHtml(student.correo)}</li>`;
  }).join('');

  const htmlBody = `
    <div style="margin:0;padding:0;background:#0f172a;color:#e5e7eb;font-family:Arial,Helvetica,sans-serif;">
      <div style="max-width:680px;margin:0 auto;padding:32px 18px;">
        <div style="background:#111827;border:1px solid #263244;border-radius:22px;overflow:hidden;">
          <div style="padding:28px 30px;background:linear-gradient(135deg,#2563eb,#7c3aed);">
            <p style="margin:0 0 8px;font-size:13px;text-transform:uppercase;letter-spacing:0.12em;color:#dbeafe;">Torneo STEAM LUVÁ 2026</p>
            <h1 style="margin:0;font-size:28px;line-height:1.2;color:#ffffff;">¡Inscripción recibida!</h1>
          </div>

          <div style="padding:30px;">
            <p style="font-size:16px;line-height:1.6;margin:0 0 18px;color:#e5e7eb;">
              Hola ${escapeHtml(data.nombreAsesor)}, recibimos correctamente la inscripción del equipo
              <strong>${escapeHtml(data.nombreProyecto)}</strong>.
            </p>

            <div style="background:#0b1120;border:1px solid #263244;border-radius:16px;padding:18px;margin:22px 0;">
              <p style="margin:0 0 8px;"><strong>Código de inscripción:</strong> ${escapeHtml(registrationId)}</p>
              <p style="margin:0 0 8px;"><strong>Categoría:</strong> ${escapeHtml(categoryLabel)}</p>
              <p style="margin:0 0 8px;"><strong>Nivel:</strong> ${escapeHtml(data.nivelEscolar)}</p>
              <p style="margin:0;"><strong>Institución:</strong> ${escapeHtml(data.institucion)}</p>
            </div>

            <h2 style="font-size:18px;margin:24px 0 10px;color:#ffffff;">Participantes registrados</h2>
            <ul style="line-height:1.7;margin-top:0;color:#d1d5db;">${studentList}</ul>

            <h2 style="font-size:18px;margin:24px 0 10px;color:#ffffff;">Comprobante de pago</h2>
            <p style="line-height:1.6;color:#d1d5db;">
              El comprobante fue recibido y quedó registrado para revisión interna de la organización.
            </p>

            <p style="line-height:1.6;color:#d1d5db;">
              Conservá este correo como respaldo. La organización revisará la información y se pondrá en contacto
              si necesita algún dato adicional o si debe corregirse algún documento.
            </p>

            <p style="margin-top:26px;line-height:1.6;color:#d1d5db;">
              Nos alegra contar con su participación.<br>
              <strong>Equipo organizador Torneo STEAM LUVÁ</strong>
            </p>
          </div>
        </div>
      </div>
    </div>`;

  const plainBody = [
    '¡Inscripción recibida!',
    '',
    `Equipo/proyecto: ${data.nombreProyecto}`,
    `Código de inscripción: ${registrationId}`,
    `Categoría: ${categoryLabel}`,
    `Institución: ${data.institucion}`,
    'Comprobante: recibido para revisión interna de la organización.',
    '',
    'Conservá este correo como respaldo. La organización revisará la información y se pondrá en contacto si requiere algún dato adicional.',
    '',
    'Equipo organizador Torneo STEAM LUVÁ'
  ].join('\n');

  MailApp.sendEmail({
    to: data.correoAsesor,
    subject: subject,
    htmlBody: htmlBody,
    body: plainBody,
    name: 'Torneo STEAM LUVÁ'
  });
}

function getCategoryLabel(value) {
  const categories = {
    seguidor: 'Seguidor de Línea',
    sumo: 'Sumo LEGO',
    laberinto: 'Laberinto',
    electrotec: 'Electrotec',
    tecnogame: 'Tecnogame & Desarrollo',
    divulgacion: 'Divulgación Científica',
    multimedia: 'Multimedia'
  };

  return categories[value] || value;
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function jsonResponse(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
