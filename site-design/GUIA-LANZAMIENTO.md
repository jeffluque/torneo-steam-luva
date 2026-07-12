# Guía de lanzamiento — Torneo STEAM LUVÁ

## 1. Conectar inscripciones con Google Sheets y correo

1. En Google Drive, crear una hoja de cálculo llamada `Inscripciones Torneo STEAM LUVÁ 2026`.
2. Dentro de la hoja, abrir **Extensiones → Apps Script**.
3. Reemplazar el contenido de `Code.gs` con el archivo `google-apps-script/Code.gs` de este proyecto y guardar.
4. Seleccionar **Implementar → Nueva implementación → Aplicación web**.
5. Configurar:
   - **Ejecutar como:** Yo.
   - **Quién tiene acceso:** Cualquier persona.
6. Pulsar **Implementar**, autorizar el acceso a Sheets, Drive y al envío de correo, y copiar la URL terminada en `/exec`.
7. En la raíz del sitio, copiar `.env.example` como `.env` y sustituir la URL de ejemplo por la URL `/exec`.
8. Ejecutar una inscripción de prueba. Debe aparecer una fila en la pestaña `Inscripciones` y llegar un correo al correo del asesor.

Notas importantes:

- La hoja y los correos quedan bajo la cuenta de Google que publica el script.
- Apps Script y Gmail tienen cuotas diarias; son suficientes para un torneo pequeño o mediano, pero conviene vigilarlas durante el lanzamiento.
- Cada vez que se cambie `Code.gs`, hay que editar la implementación y publicar una versión nueva.
- El comprobante de pago se recibe desde el formulario, se guarda en Drive en la carpeta `Comprobantes Torneo STEAM LUVÁ 2026`, y la URL queda registrada en la hoja de cálculo.
- El formulario acepta comprobantes en PDF, JPG, PNG o WebP, con tamaño máximo de 5 MB.

## 2. Agregar reglamentos

Copiar los PDF en `public/reglamentos/` usando exactamente estos nombres:

- `seguidor-de-linea.pdf`
- `sumo-lego.pdf`
- `laberinto.pdf`
- `electrotec.pdf`
- `tecnogame-y-desarrollo.pdf`
- `divulgacion-cientifica.pdf`
- `multimedia.pdf`

Los botones del sitio ya apuntan a esas rutas.

## 3. Cambiar fotografías

Guardar las fotos optimizadas dentro de `src/imports/fotos/` y reemplazar las URL de Unsplash en `src/app/pages/Landing.tsx` por imports locales. Recomendación: WebP o AVIF, ancho de 1600–2000 px para portada y 800–1200 px para tarjetas, idealmente menos de 350 KB por imagen.

## 4. Probar y construir

Desde la carpeta `site-design`:

```powershell
npm install
npm run dev
npm run build
```

La versión publicable queda en `dist/`. Probar al menos portada, navegación móvil, `/registro`, envío real, correo recibido y todos los PDF.

## 5. Publicar gratis y enlazar el subdominio

Opción recomendada: Cloudflare Pages.

1. Crear un proyecto de Pages y conectar el repositorio, o usar carga directa de la carpeta `dist`.
2. Si se conecta un repositorio, usar `npm run build` como comando y `dist` como directorio de salida. Configurar `VITE_REGISTRATION_ENDPOINT` como variable de entorno.
3. En Pages, abrir **Custom domains** y agregar el dominio comprado: `www.torneoluva.com`.
4. Como el dominio está en GoDaddy, Cloudflare Pages indicará un destino tipo `<nombre-del-proyecto>.pages.dev`.
5. Entrar a GoDaddy → **Domain Portfolio** → `torneoluva.com` → **DNS**.
6. Revisar si ya existe un registro `CNAME` con nombre `www`.
   - Si existe, editarlo.
   - Si no existe, crear uno nuevo.
7. Usar estos datos:
   - **Type:** `CNAME`
   - **Name:** `www`
   - **Value:** el destino exacto que indique Cloudflare Pages, normalmente `<nombre-del-proyecto>.pages.dev`
   - **TTL:** dejar el valor predeterminado, usualmente 1 hora.
8. Guardar el cambio en GoDaddy.
9. Volver a Cloudflare Pages y esperar que el dominio quede activo con HTTPS.
10. Probar `https://www.torneoluva.com`, `/registro`, envío del formulario, correo de confirmación y botones de reglamentos.

Importante: no crear el CNAME en GoDaddy antes de agregar `www.torneoluva.com` en **Custom domains** de Cloudflare Pages. Cloudflare recomienda asociar primero el dominio desde Pages y luego crear el CNAME que Pages indique.

No compartir contraseñas de GoDaddy por archivos o chat. Es preferible hacer el cambio juntos en pantalla o dar acceso limitado a la cuenta responsable.

## Lista de control antes de abrir inscripciones

- Formulario probado de punta a punta con una inscripción ficticia.
- Hoja de cálculo compartida solo con el equipo organizador.
- Correo de confirmación revisado y cuenta remitente reconocible.
- Reglamentos definitivos cargados.
- Fotos con permiso de uso y texto alternativo adecuado.
- Fechas, costos, categorías, contactos y políticas de datos revisados.
- Subdominio con HTTPS y navegación móvil comprobada.
