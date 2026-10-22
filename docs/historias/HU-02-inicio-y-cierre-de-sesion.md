# HU-02: Inicio y cierre de sesión

**Como** usuario registrado, **quiero** iniciar y cerrar sesión, **para** usar mi cuenta de forma segura.

## Criterios de aceptación
- Con credenciales válidas se accede al panel; con credenciales inválidas se muestra un error.
- El botón "Cerrar sesión" invalida la sesión y vuelve al login.
- La sesión expira tras un periodo de inactividad configurable.

## Criterios de seguridad

**Estado:** 0 de 5 criterios de seguridad cumplidos.

- [ ] El mensaje de error es idéntico para usuario inexistente y contraseña incorrecta.
- [ ] Tras 5 intentos fallidos se bloquea la cuenta temporalmente o se aplica retardo progresivo.
- [ ] La cookie de sesión usa `HttpOnly`, `Secure` y `SameSite=Strict`.
- [ ] El identificador de sesión se regenera al iniciar sesión y se invalida en el servidor al cerrarla.
- [ ] Se registran los intentos fallidos sin guardar la contraseña.
