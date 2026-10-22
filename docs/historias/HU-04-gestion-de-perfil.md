# HU-04: Gestión de perfil

**Como** usuario autenticado, **quiero** ver y editar mis datos de perfil, **para** mantener mi información actualizada.

## Criterios de aceptación
- El usuario ve su nombre y correo, y puede editar el nombre.
- Los cambios se reflejan de inmediato tras guardar.
- Si el guardado falla, se conserva lo escrito y se muestra el motivo.

## Criterios de seguridad

**Estado:** 0 de 5 criterios de seguridad cumplidos.

- [ ] Un usuario solo puede leer y modificar su propio perfil; se verifica en el servidor (control de acceso a nivel de objeto, sin IDOR).
- [ ] Los datos mostrados se escapan al renderizar para prevenir XSS.
- [ ] Los cambios de correo exigen reconfirmación del nuevo correo y de la contraseña actual.
- [ ] Se usa protección CSRF (token o `SameSite`) en las operaciones de escritura.
- [ ] Se rechazan campos no esperados en la petición (sin mass assignment).
