# HU-09: Detección de secretos

**Como** responsable de seguridad, **quiero** impedir que se suban credenciales al repositorio, **para** evitar fugas de información sensible.

## Criterios de aceptación
- Un hook pre-commit y el pipeline escanean claves, tokens y contraseñas (por ejemplo gitleaks).
- Si se detecta un secreto, el commit o el build fallan con un mensaje claro.
- `.gitignore` excluye `.env` y otros archivos de configuración local.
- Existe un `.env.example` con valores ficticios.

## Criterios de seguridad

**Estado:** 0 de 4 criterios de seguridad cumplidos.

- [ ] Los secretos reales se guardan en el gestor de secretos de la plataforma, nunca en el código.
- [ ] Un secreto detectado se considera comprometido: se rota y se revisa el historial.
- [ ] Se activa el escaneo de secretos y la protección contra push del repositorio.
- [ ] Los logs del pipeline enmascaran los valores secretos.
