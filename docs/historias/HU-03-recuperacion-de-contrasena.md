# HU-03: Recuperación de contraseña

**Como** usuario, **quiero** restablecer mi contraseña si la olvido, **para** recuperar el acceso.

## Criterios de aceptación
- Al solicitar la recuperación se envía un enlace al correo registrado.
- El enlace permite definir una nueva contraseña que cumple la política vigente.
- Tras el cambio, se informa al usuario y se le pide iniciar sesión.

## Criterios de seguridad

**Estado:** 0 de 5 criterios de seguridad cumplidos.

- [ ] La respuesta es la misma exista o no el correo (evita enumeración de usuarios).
- [ ] El token es aleatorio, de un solo uso y caduca en 15 minutos como máximo.
- [ ] El token se guarda hasheado en el servidor.
- [ ] Al cambiar la contraseña se cierran todas las sesiones activas.
- [ ] La solicitud tiene límite de frecuencia por cuenta e IP.
