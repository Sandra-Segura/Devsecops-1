# HU-06: Pipeline de integración continua

**Como** desarrollador, **quiero** que cada push y pull request ejecute pruebas automáticamente, **para** detectar errores antes de integrar.

## Criterios de aceptación
- El pipeline se dispara en cada push a `main` y en cada pull request.
- Ejecuta `npm ci` y `npm test`, y falla si alguna prueba falla.
- El resultado es visible en el pull request y bloquea el merge si falla.
- El pipeline termina en menos de 5 minutos.

## Criterios de seguridad

**Estado:** 3 de 5 criterios de seguridad cumplidos.

- [x] Los permisos del token del pipeline son de solo lectura por defecto (`permissions: contents: read`). *(ci.yml: `permissions: contents: read`)*
- [x] Las acciones de terceros se fijan por versión o hash de commit. *(ci.yml: fijadas a versión mayor (`@v4`), no a hash)*
- [x] Los pull requests de forks no tienen acceso a secretos. *(los workflows no usan secretos)*
- [ ] `main` está protegida: requiere revisión y checks en verde, sin push directo.
- [ ] Los workflows definen un timeout y cancelan las ejecuciones redundantes.
