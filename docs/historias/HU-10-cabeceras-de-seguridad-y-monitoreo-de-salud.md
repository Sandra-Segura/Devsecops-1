# HU-10: Cabeceras de seguridad y monitoreo de salud

**Como** operador, **quiero** que el servidor aplique cabeceras seguras y exponga su estado, **para** reducir la superficie de ataque y detectar caídas.

## Criterios de aceptación
- `GET /health` responde 200 con `{ "status": "ok" }` y no requiere autenticación.
- Una prueba automatizada verifica la presencia de las cabeceras de seguridad.
- Las rutas inexistentes devuelven 404 sin detalles técnicos.
- El servidor registra cada petición con método, ruta y código de estado.

## Criterios de seguridad
- Se envían `Content-Security-Policy`, `X-Content-Type-Options: nosniff`, `X-Frame-Options` o `frame-ancestors`, `Referrer-Policy` y `Strict-Transport-Security`.
- Se elimina o no se expone información de versión del servidor.
- `/health` no revela versiones, rutas internas ni datos de configuración.
- Las respuestas de error no incluyen trazas de pila.
- El servidor impide path traversal al servir archivos estáticos (ya cubierto con la comprobación de ruta).
