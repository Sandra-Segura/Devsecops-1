# HU-08: Análisis estático de código (SAST)

**Como** responsable de seguridad, **quiero** analizar el código en cada cambio, **para** encontrar vulnerabilidades antes del despliegue.

## Criterios de aceptación
- El pipeline ejecuta un análisis estático (CodeQL o equivalente) en cada pull request.
- Los hallazgos aparecen como anotaciones en el pull request.
- Se ejecuta un linter con reglas de seguridad para JavaScript.
- Los falsos positivos se pueden marcar con justificación.

## Criterios de seguridad

**Estado:** 0 de 4 criterios de seguridad cumplidos.

- [ ] Los hallazgos de severidad alta bloquean el merge.
- [ ] Los resultados solo son visibles para quienes tienen acceso al repositorio.
- [ ] Las reglas se mantienen actualizadas y se revisan periódicamente.
- [ ] Se cubren al menos inyección, XSS, path traversal y uso inseguro de `eval`.
