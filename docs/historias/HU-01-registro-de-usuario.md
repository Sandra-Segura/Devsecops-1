# HU-01: Registro de usuario

**Como** visitante, **quiero** crear una cuenta con correo y contraseña, **para** acceder a las funciones de la aplicación.

## Criterios de aceptación
- El formulario solicita correo y contraseña, y valida el formato antes de enviar.
- Si el correo ya existe, se muestra un mensaje genérico sin confirmar si la cuenta existe.
- Tras el registro exitoso, el usuario es redirigido al inicio de sesión.
- Los errores se muestran junto al campo correspondiente y son accesibles (aria-live).

## Criterios de seguridad

**Estado:** 0 de 5 criterios de seguridad cumplidos.

- [ ] La contraseña exige mínimo 12 caracteres y se rechaza si figura en listas de contraseñas filtradas.
- [ ] La contraseña se almacena con un hash lento y con sal (argon2id o bcrypt); nunca en texto plano ni en logs.
- [ ] La entrada se valida y sanea en el servidor, no solo en el cliente.
- [ ] El endpoint tiene límite de peticiones por IP para frenar el registro masivo.
- [ ] El envío se hace solo por HTTPS.
