const SHEET_NAME = 'Inscripciones';

function doPost(e) {
  const lock = LockService.getScriptLock();

  try {
    lock.waitLock(10000);
    const data = JSON.parse(e.parameter.payload || '{}');
    validateRegistration(data);

    const sheet = getRegistrationSheet();
    const registrationId = Utilities.getUuid();
    const students = data.integrantes.map(function (student, index) {
      return `${index + 1}. ${student.nombre} | ${student.edad} años | ${student.correo} | ${student.genero}`;
    }).join('\n');

    sheet.appendRow([
      new Date(), registrationId, data.nombreProyecto, data.categoria, data.nivelEscolar,
      data.institucion, data.provincia, data.distrito, data.nombreDirector,
      data.emailInstitucion, data.nombreAsesor, data.rolAsesor, data.generoAsesor,
      data.correoAsesor, data.telefonoAsesor, students, data.observaciones || ''
    ]);

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
    sheet.appendRow([
      'Fecha', 'ID', 'Proyecto/Equipo', 'Categoría', 'Nivel', 'Institución',
      'Provincia', 'Distrito', 'Director(a)', 'Correo institución', 'Asesor(a)',
      'Rol', 'Género asesor(a)', 'Correo asesor(a)', 'Teléfono', 'Estudiantes',
      'Observaciones'
    ]);
    sheet.setFrozenRows(1);
  }

  return sheet;
}

function validateRegistration(data) {
  const required = [
    'nombreProyecto', 'categoria', 'nivelEscolar', 'institucion', 'provincia',
    'distrito', 'nombreDirector', 'emailInstitucion', 'nombreAsesor', 'rolAsesor',
    'generoAsesor', 'correoAsesor', 'telefonoAsesor'
  ];

  required.forEach(function (field) {
    if (!String(data[field] || '').trim()) throw new Error(`Falta el campo ${field}.`);
  });

  if (!data.terminos) throw new Error('Se deben aceptar los términos.');
  if (!Array.isArray(data.integrantes) || data.integrantes.length < 1 || data.integrantes.length > 3) {
    throw new Error('La inscripción debe incluir entre 1 y 3 estudiantes.');
  }
}

function sendConfirmationEmail(data, registrationId) {
  const subject = `Inscripción recibida: ${data.nombreProyecto}`;
  const studentList = data.integrantes.map(function (student) {
    return `<li>${escapeHtml(student.nombre)} (${escapeHtml(student.edad)} años)</li>`;
  }).join('');

  const htmlBody = `
    <h2>¡Inscripción confirmada!</h2>
    <p>Hola ${escapeHtml(data.nombreAsesor)}, recibimos la inscripción del equipo <strong>${escapeHtml(data.nombreProyecto)}</strong>.</p>
    <p><strong>Categoría:</strong> ${escapeHtml(data.categoria)}<br>
    <strong>Institución:</strong> ${escapeHtml(data.institucion)}<br>
    <strong>Código de inscripción:</strong> ${registrationId}</p>
    <p><strong>Participantes:</strong></p><ul>${studentList}</ul>
    <p>Conservá este correo como comprobante. La organización se pondrá en contacto si requiere información adicional.</p>`;

  MailApp.sendEmail({
    to: data.correoAsesor,
    subject: subject,
    htmlBody: htmlBody,
    name: 'Torneo STEAM LUVÁ'
  });
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

function jsonResponse(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
