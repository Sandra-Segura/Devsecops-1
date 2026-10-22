# HU-06: Pipeline de integración continua

**Como** desarrollador, **quiero** que cada push y pull request ejecute pruebas automáticamente, **para** detectar errores antes de integrar.

## Criterios de aceptación
- El pipeline se dispara en cada push a `main` y en cada pull request.
- Ejecuta `npm ci` y `npm test`, y falla si alguna prueba falla.
- El resultado es visible en el pull request y bloquea el merge si falla.
- El pipeline termina en menos de 5 minutos.

## Criterios de seguridad
- Los permisos del token del pipeline son de solo lectura por defecto (`permissions: contents: read`).
- Las acciones de terceros se fijan por versión o hash de commit.
- Los pull requests de forks no tienen acceso a secretos.
- `main` está protegida: requiere revisión y checks en verde, sin push directo.
