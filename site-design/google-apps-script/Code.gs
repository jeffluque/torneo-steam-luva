const SHEET_NAME = 'Inscripciones';
const IMPORTED_TEAMS_SHEET_NAME = 'Equipos importados';
const EVALUATIONS_SHEET_NAME = 'Evaluaciones';
const USER_PREFIX = 'USER_';
const SESSION_PREFIX = 'SESSION_';
const SESSION_HOURS = 8;
const PAYMENT_FOLDER_NAME = 'Comprobantes Torneo STEAM LUVÁ 2026';
const MAX_PAYMENT_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_PAYMENT_MIME_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
const ALLOWED_PAYMENT_EXTENSIONS = ['.pdf', '.jpg', '.jpeg', '.png', '.webp'];
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
    if (data.action === 'login') return loginPortal(data);
    if (data.action === 'logout') return logoutPortal(data.token);
    if (data.action === 'bootstrap') return bootstrapPortal(data.token);
    if (data.action === 'saveEvaluation') return saveEvaluationPortal(data.token, data.evaluation);
    if (data.action === 'importTeams') {
      requireSession(data.token, ['admin']);
      return importTeamsBatch(data.teams || []);
    }
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
      paymentUrl
    ]);

    const lastRow = sheet.getLastRow();
    formatPaymentLink(sheet, lastRow, paymentUrl);

    sendConfirmationEmail(data, registrationId);
    return jsonResponse({ ok: true, registrationId: registrationId });
  } catch (error) {
    console.error(error);
    return jsonResponse({ ok: false, error: error.message });
  } finally {
    lock.releaseLock();
  }
}

function crearUsuarioPortal(usuario, contrasena, nombre, rol) {
  usuario = String(usuario || '').trim().toLowerCase();
  rol = String(rol || '').trim().toLowerCase();
  if (!usuario || String(contrasena || '').length < 10) throw new Error('El usuario es requerido y la contraseña debe tener al menos 10 caracteres.');
  if (['admin', 'judge'].indexOf(rol) === -1) throw new Error('El rol debe ser admin o judge.');
  const salt = Utilities.getUuid();
  const record = { username: usuario, name: String(nombre || usuario), role: rol, salt: salt, hash: hashPassword(String(contrasena), salt), active: true };
  PropertiesService.getScriptProperties().setProperty(USER_PREFIX + usuario, JSON.stringify(record));
  return 'Usuario creado: ' + usuario;
}

function hashPassword(password, salt) {
  const bytes = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, salt + ':' + password, Utilities.Charset.UTF_8);
  return bytes.map(function(byte) { const value = byte < 0 ? byte + 256 : byte; return ('0' + value.toString(16)).slice(-2); }).join('');
}

function loginPortal(data) {
  const username = String(data.username || '').trim().toLowerCase();
  const raw = PropertiesService.getScriptProperties().getProperty(USER_PREFIX + username);
  if (!raw) throw new Error('Usuario o contraseña incorrectos.');
  const user = JSON.parse(raw);
  if (!user.active || user.hash !== hashPassword(String(data.password || ''), user.salt)) throw new Error('Usuario o contraseña incorrectos.');
  const token = Utilities.getUuid() + Utilities.getUuid();
  const session = { username: user.username, name: user.name, role: user.role, expiresAt: Date.now() + SESSION_HOURS * 60 * 60 * 1000 };
  PropertiesService.getScriptProperties().setProperty(SESSION_PREFIX + token, JSON.stringify(session));
  return jsonResponse({ ok: true, token: token, user: { username: user.username, name: user.name, role: user.role }, teams: getAllTeamsForPortal(), evaluations: getEvaluationsForPortal(user) });
}

function requireSession(token, roles) {
  const properties = PropertiesService.getScriptProperties();
  const key = SESSION_PREFIX + String(token || '');
  const raw = properties.getProperty(key);
  if (!raw) throw new Error('Sesión inválida o vencida.');
  const session = JSON.parse(raw);
  if (Number(session.expiresAt) < Date.now()) { properties.deleteProperty(key); throw new Error('Sesión vencida.'); }
  if (roles && roles.indexOf(session.role) === -1) throw new Error('Acceso no autorizado.');
  return session;
}

function logoutPortal(token) {
  PropertiesService.getScriptProperties().deleteProperty(SESSION_PREFIX + String(token || ''));
  return jsonResponse({ ok: true });
}

function bootstrapPortal(token) {
  const session = requireSession(token, ['admin', 'judge']);
  return jsonResponse({ ok: true, teams: getAllTeamsForPortal(), evaluations: getEvaluationsForPortal(session) });
}

function saveEvaluationPortal(token, evaluation) {
  const session = requireSession(token, ['admin', 'judge']);
  if (!evaluation || !evaluation.teamId || !evaluation.category) throw new Error('Evaluación incompleta.');
  const sheet = getEvaluationSheet();
  const id = Utilities.getUuid();
  sheet.appendRow([new Date(), id, session.username, session.name, evaluation.category, evaluation.teamId, evaluation.teamName || '', JSON.stringify(evaluation.values || {}), evaluation.total === null ? '' : evaluation.total, evaluation.effectiveTime === null ? '' : evaluation.effectiveTime, evaluation.notes || '']);
  return jsonResponse({ ok: true, id: id });
}

function getEvaluationSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(EVALUATIONS_SHEET_NAME);
  if (!sheet) sheet = spreadsheet.insertSheet(EVALUATIONS_SHEET_NAME);
  if (sheet.getLastRow() === 0) sheet.appendRow(['Fecha', 'ID', 'Usuario juez', 'Nombre juez', 'Categoria', 'ID equipo', 'Equipo', 'Valores JSON', 'Total', 'Tiempo efectivo', 'Observaciones']);
  sheet.setFrozenRows(1);
  return sheet;
}

function getEvaluationsForPortal(session) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(EVALUATIONS_SHEET_NAME);
  if (!sheet || sheet.getLastRow() < 2) return [];
  return sheet.getRange(2, 1, sheet.getLastRow() - 1, 11).getValues().filter(function(row) { return session.role === 'admin' || row[2] === session.username; }).map(function(row) {
    return { createdAt: row[0], id: row[1], judge: row[2], judgeName: row[3], category: row[4], teamId: row[5], teamName: row[6], values: JSON.parse(row[7] || '{}'), total: row[8] === '' ? null : Number(row[8]), effectiveTime: row[9] === '' ? null : Number(row[9]), notes: row[10] || '', selected: false };
  });
}

function doGet(e) {
  try {
    const action = String((e && e.parameter && e.parameter.action) || 'health');
    if (action === 'teams') return jsonResponse({ ok: true, teams: getAllTeamsForPortal() });
    return jsonResponse({ ok: true, service: 'Torneo STEAM LUVA 2026' });
  } catch (error) {
    return jsonResponse({ ok: false, error: error.message });
  }
}

function importTeamsBatch(teams) {
  if (!Array.isArray(teams) || teams.length < 1) throw new Error('No se recibieron equipos.');
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(IMPORTED_TEAMS_SHEET_NAME);
  if (!sheet) sheet = spreadsheet.insertSheet(IMPORTED_TEAMS_SHEET_NAME);
  const headers = ['Fecha', 'ID', 'Equipo', 'Categoria', 'Nivel', 'Institucion', 'Provincia', 'Distrito', 'Director', 'Correo institucion', 'Asesor', 'Rol asesor', 'Genero asesor', 'Telefono asesor', 'Correo asesor', 'Estudiantes JSON', 'Origen'];
  if (sheet.getLastRow() === 0) sheet.appendRow(headers);
  const existing = sheet.getLastRow() > 1 ? sheet.getRange(2, 2, sheet.getLastRow() - 1, 1).getValues().flat() : [];
  const existingIds = new Set(existing.map(String));
  const rows = teams.filter(function(team) { return team.id && !existingIds.has(String(team.id)); }).map(function(team) {
    if (!team.name || !team.category || !team.institution || !Array.isArray(team.students) || team.students.length < 1 || team.students.length > 3) throw new Error('Equipo importado invalido: ' + (team.name || 'sin nombre'));
    return [new Date(), team.id, team.name, team.category, team.level || '', team.institution, team.province || '', team.district || '', team.director || '', team.institutionEmail || '', team.advisor || '', team.advisorRole || '', team.advisorGender || '', team.advisorPhone || '', team.advisorEmail || '', JSON.stringify(team.students), 'Excel'];
  });
  if (rows.length) sheet.getRange(sheet.getLastRow() + 1, 1, rows.length, headers.length).setValues(rows);
  sheet.setFrozenRows(1);
  return jsonResponse({ ok: true, added: rows.length, duplicates: teams.length - rows.length });
}

function getAllTeamsForPortal() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const teams = [];
  const registrations = spreadsheet.getSheetByName(SHEET_NAME);
  if (registrations && registrations.getLastRow() > 1) {
    registrations.getRange(2, 1, registrations.getLastRow() - 1, 19).getValues().forEach(function(row) {
      teams.push({ createdAt: row[0], id: row[1], name: row[2], category: row[3], level: row[4], institution: row[5], province: row[6], district: row[7], director: row[8], institutionEmail: row[9], advisor: row[10], advisorRole: row[11], advisorGender: row[12], advisorEmail: row[13], advisorPhone: row[14], students: parseStudentsCell(row[15]), source: 'web' });
    });
  }
  const imported = spreadsheet.getSheetByName(IMPORTED_TEAMS_SHEET_NAME);
  if (imported && imported.getLastRow() > 1) {
    imported.getRange(2, 1, imported.getLastRow() - 1, 17).getValues().forEach(function(row) {
      teams.push({ createdAt: row[0], id: row[1], name: row[2], category: row[3], level: row[4], institution: row[5], province: row[6], district: row[7], director: row[8], institutionEmail: row[9], advisor: row[10], advisorRole: row[11], advisorGender: row[12], advisorPhone: row[13], advisorEmail: row[14], students: JSON.parse(row[15] || '[]'), source: 'excel' });
    });
  }
  return teams;
}

function parseStudentsCell(value) {
  return String(value || '').split(/\r?\n/).filter(String).map(function(line) {
    const parts = line.replace(/^\s*\d+\.\s*/, '').split('|').map(function(part) { return part.trim(); });
    return { name: parts[0] || '', age: Number(String(parts[1] || '').replace(/\D/g, '')) || 0, email: parts[2] || '', gender: parts[3] || '' };
  });
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

function configurarHojaInscripciones() {
  getRegistrationSheet();
  getOrCreateFolder(PAYMENT_FOLDER_NAME);
}

function formatPaymentLink(sheet, row, paymentUrl) {
  const paymentCell = sheet.getRange(row, 19);
  paymentCell.setValue(paymentUrl);

  try {
    paymentCell.setRichTextValue(
      SpreadsheetApp.newRichTextValue()
        .setText('Ver comprobante')
        .setLinkUrl(paymentUrl)
        .build()
    );
  } catch (error) {
    console.error('No se pudo aplicar el enlace enriquecido del comprobante:', error);
    paymentCell.setValue(paymentUrl);
  }
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
  if (!isAllowedPaymentReceipt(file)) {
    throw new Error('El comprobante debe ser PDF, JPG, PNG o WebP.');
  }
}

function isAllowedPaymentReceipt(file) {
  const fileName = String(file.name || '').toLowerCase();
  const fileType = String(file.type || '').toLowerCase();

  return ALLOWED_PAYMENT_MIME_TYPES.indexOf(fileType) !== -1 ||
    ALLOWED_PAYMENT_EXTENSIONS.some(function (extension) {
      return fileName.endsWith(extension);
    });
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
    'reto-robotica': 'Reto de Robótica',
    tecnogame: 'Tecnogame y Desarrollo de Software',
    divulgacion: 'Divulgación Científica',
    multimedia: 'Multimedia',
    'robotica-proyectos': 'Robótica (Exposición de proyectos robóticos con prototipo)'
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
