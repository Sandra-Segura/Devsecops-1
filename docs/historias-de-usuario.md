# Historias de usuario

Backlog inicial del proyecto. Las HU-01 a HU-05 describen funcionalidad de la aplicación y las HU-06 a HU-10 describen capacidades DevSecOps de la plataforma. Cada historia incluye criterios de aceptación (funcionales) y criterios de seguridad.

---

## HU-01: Registro de usuario

**Como** visitante, **quiero** crear una cuenta con correo y contraseña, **para** acceder a las funciones de la aplicación.

**Criterios de aceptación**
- El formulario solicita correo y contraseña, y valida el formato antes de enviar.
- Si el correo ya existe, se muestra un mensaje genérico sin confirmar si la cuenta existe.
- Tras el registro exitoso, el usuario es redirigido al inicio de sesión.
- Los errores se muestran junto al campo correspondiente y son accesibles (aria-live).

**Criterios de seguridad**
- La contraseña exige mínimo 12 caracteres y se rechaza si figura en listas de contraseñas filtradas.
- La contraseña se almacena con un hash lento y con sal (argon2id o bcrypt); nunca en texto plano ni en logs.
- La entrada se valida y sanea en el servidor, no solo en el cliente.
- El endpoint tiene límite de peticiones por IP para frenar el registro masivo.
- El envío se hace solo por HTTPS.

---

## HU-02: Inicio y cierre de sesión

**Como** usuario registrado, **quiero** iniciar y cerrar sesión, **para** usar mi cuenta de forma segura.

**Criterios de aceptación**
- Con credenciales válidas se accede al panel; con credenciales inválidas se muestra un error.
- El botón "Cerrar sesión" invalida la sesión y vuelve al login.
- La sesión expira tras un periodo de inactividad configurable.

**Criterios de seguridad**
- El mensaje de error es idéntico para usuario inexistente y contraseña incorrecta.
- Tras 5 intentos fallidos se bloquea la cuenta temporalmente o se aplica retardo progresivo.
- La cookie de sesión usa `HttpOnly`, `Secure` y `SameSite=Strict`.
- El identificador de sesión se regenera al iniciar sesión y se invalida en el servidor al cerrarla.
- Se registran los intentos fallidos sin guardar la contraseña.

---

## HU-03: Recuperación de contraseña

**Como** usuario, **quiero** restablecer mi contraseña si la olvido, **para** recuperar el acceso.

**Criterios de aceptación**
- Al solicitar la recuperación se envía un enlace al correo registrado.
- El enlace permite definir una nueva contraseña que cumple la política vigente.
- Tras el cambio, se informa al usuario y se le pide iniciar sesión.

**Criterios de seguridad**
- La respuesta es la misma exista o no el correo (evita enumeración de usuarios).
- El token es aleatorio, de un solo uso y caduca en 15 minutos como máximo.
- El token se guarda hasheado en el servidor.
- Al cambiar la contraseña se cierran todas las sesiones activas.
- La solicitud tiene límite de frecuencia por cuenta e IP.

---

## HU-04: Gestión de perfil

**Como** usuario autenticado, **quiero** ver y editar mis datos de perfil, **para** mantener mi información actualizada.

**Criterios de aceptación**
- El usuario ve su nombre y correo, y puede editar el nombre.
- Los cambios se reflejan de inmediato tras guardar.
- Si el guardado falla, se conserva lo escrito y se muestra el motivo.

**Criterios de seguridad**
- Un usuario solo puede leer y modificar su propio perfil; se verifica en el servidor (control de acceso a nivel de objeto, sin IDOR).
- Los datos mostrados se escapan al renderizar para prevenir XSS.
- Los cambios de correo exigen reconfirmación del nuevo correo y de la contraseña actual.
- Se usa protección CSRF (token o `SameSite`) en las operaciones de escritura.
- Se rechazan campos no esperados en la petición (sin mass assignment).

---

## HU-05: Listado y búsqueda de elementos

**Como** usuario, **quiero** listar y buscar mis elementos, **para** encontrarlos rápidamente.

**Criterios de aceptación**
- El listado se pagina y permite ordenar por fecha.
- La búsqueda filtra por texto y muestra un estado vacío si no hay resultados.
- Con más de 1000 elementos, la respuesta sigue siendo ágil.

**Criterios de seguridad**
- Los parámetros de búsqueda, orden y paginación se validan contra listas permitidas y tipos esperados (previene inyección).
- Las consultas a la base de datos son parametrizadas.
- El tamaño máximo de página está limitado en el servidor.
- El resultado incluye únicamente elementos del usuario autenticado.
- El texto de búsqueda se escapa al reflejarse en la página.

---

## HU-06: Pipeline de integración continua

**Como** desarrollador, **quiero** que cada push y pull request ejecute pruebas automáticamente, **para** detectar errores antes de integrar.

**Criterios de aceptación**
- El pipeline se dispara en cada push a `main` y en cada pull request.
- Ejecuta `npm ci` y `npm test`, y falla si alguna prueba falla.
- El resultado es visible en el pull request y bloquea el merge si falla.
- El pipeline termina en menos de 5 minutos.

**Criterios de seguridad**
- Los permisos del token del pipeline son de solo lectura por defecto (`permissions: contents: read`).
- Las acciones de terceros se fijan por versión o hash de commit.
- Los pull requests de forks no tienen acceso a secretos.
- `main` está protegida: requiere revisión y checks en verde, sin push directo.

---

## HU-07: Análisis de dependencias

**Como** responsable de seguridad, **quiero** detectar dependencias vulnerables, **para** evitar incorporar componentes con CVE conocidos.

**Criterios de aceptación**
- El pipeline ejecuta `npm audit` y publica el informe.
- Se fija un umbral: el build falla con vulnerabilidades altas o críticas.
- Se generan actualizaciones automáticas de dependencias (por ejemplo Dependabot).
- El informe indica paquete, versión afectada y versión corregida.

**Criterios de seguridad**
- Se versiona el `package-lock.json` y se instala con `npm ci` para builds reproducibles.
- Las excepciones aceptadas se documentan con justificación y fecha de revisión.
- Se genera un SBOM (por ejemplo CycloneDX) en cada release.
- Los paquetes nuevos se revisan por mantenimiento y reputación antes de añadirse.

---

## HU-08: Análisis estático de código (SAST)

**Como** responsable de seguridad, **quiero** analizar el código en cada cambio, **para** encontrar vulnerabilidades antes del despliegue.

**Criterios de aceptación**
- El pipeline ejecuta un análisis estático (CodeQL o equivalente) en cada pull request.
- Los hallazgos aparecen como anotaciones en el pull request.
- Se ejecuta un linter con reglas de seguridad para JavaScript.
- Los falsos positivos se pueden marcar con justificación.

**Criterios de seguridad**
- Los hallazgos de severidad alta bloquean el merge.
- Los resultados solo son visibles para quienes tienen acceso al repositorio.
- Las reglas se mantienen actualizadas y se revisan periódicamente.
- Se cubren al menos inyección, XSS, path traversal y uso inseguro de `eval`.

---

## HU-09: Detección de secretos

**Como** responsable de seguridad, **quiero** impedir que se suban credenciales al repositorio, **para** evitar fugas de información sensible.

**Criterios de aceptación**
- Un hook pre-commit y el pipeline escanean claves, tokens y contraseñas (por ejemplo gitleaks).
- Si se detecta un secreto, el commit o el build fallan con un mensaje claro.
- `.gitignore` excluye `.env` y otros archivos de configuración local.
- Existe un `.env.example` con valores ficticios.

**Criterios de seguridad**
- Los secretos reales se guardan en el gestor de secretos de la plataforma, nunca en el código.
- Un secreto detectado se considera comprometido: se rota y se revisa el historial.
- Se activa el escaneo de secretos y la protección contra push del repositorio.
- Los logs del pipeline enmascaran los valores secretos.

---

## HU-10: Cabeceras de seguridad y monitoreo de salud

**Como** operador, **quiero** que el servidor aplique cabeceras seguras y exponga su estado, **para** reducir la superficie de ataque y detectar caídas.

**Criterios de aceptación**
- `GET /health` responde 200 con `{ "status": "ok" }` y no requiere autenticación.
- Una prueba automatizada verifica la presencia de las cabeceras de seguridad.
- Las rutas inexistentes devuelven 404 sin detalles técnicos.
- El servidor registra cada petición con método, ruta y código de estado.

**Criterios de seguridad**
- Se envían `Content-Security-Policy`, `X-Content-Type-Options: nosniff`, `X-Frame-Options` o `frame-ancestors`, `Referrer-Policy` y `Strict-Transport-Security`.
- Se elimina o no se expone información de versión del servidor.
- `/health` no revela versiones, rutas internas ni datos de configuración.
- Las respuestas de error no incluyen trazas de pila.
- El servidor impide path traversal al servir archivos estáticos (ya cubierto con la comprobación de ruta).
