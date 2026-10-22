# HU-07: Análisis de dependencias

**Como** responsable de seguridad, **quiero** detectar dependencias vulnerables, **para** evitar incorporar componentes con CVE conocidos.

## Criterios de aceptación
- El pipeline ejecuta `npm audit` y publica el informe.
- Se fija un umbral: el build falla con vulnerabilidades altas o críticas.
- Se generan actualizaciones automáticas de dependencias (por ejemplo Dependabot).
- El informe indica paquete, versión afectada y versión corregida.

## Criterios de seguridad
- Se versiona el `package-lock.json` y se instala con `npm ci` para builds reproducibles.
- Las excepciones aceptadas se documentan con justificación y fecha de revisión.
- Se genera un SBOM (por ejemplo CycloneDX) en cada release.
- Los paquetes nuevos se revisan por mantenimiento y reputación antes de añadirse.
