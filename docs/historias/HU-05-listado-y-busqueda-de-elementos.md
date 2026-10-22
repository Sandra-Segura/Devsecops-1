# HU-05: Listado y búsqueda de elementos

**Como** usuario, **quiero** listar y buscar mis elementos, **para** encontrarlos rápidamente.

## Criterios de aceptación
- El listado se pagina y permite ordenar por fecha.
- La búsqueda filtra por texto y muestra un estado vacío si no hay resultados.
- Con más de 1000 elementos, la respuesta sigue siendo ágil.

## Criterios de seguridad
- Los parámetros de búsqueda, orden y paginación se validan contra listas permitidas y tipos esperados (previene inyección).
- Las consultas a la base de datos son parametrizadas.
- El tamaño máximo de página está limitado en el servidor.
- El resultado incluye únicamente elementos del usuario autenticado.
- El texto de búsqueda se escapa al reflejarse en la página.
