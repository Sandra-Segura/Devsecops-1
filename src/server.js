const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const PORT = process.env.PORT || 3000;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.ico': 'image/x-icon',
};

// HU-10: cabeceras de seguridad aplicadas a todas las respuestas
const SECURITY_HEADERS = {
  'Content-Security-Policy': "default-src 'self'; frame-ancestors 'none'",
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'no-referrer',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
};

const NUMERO_VALIDO = /^-?\d{1,6}(\.\d{1,4})?$/;

// feature/feature1: conversión de Celsius a Fahrenheit con validación estricta
function celsiusAFahrenheit(valor) {
  if (typeof valor !== 'string' || !NUMERO_VALIDO.test(valor)) {
    return null;
  }
  const celsius = Number(valor);
  if (celsius < -273.15) {
    return null; // por debajo del cero absoluto
  }
  return Number((celsius * 9 / 5 + 32).toFixed(4));
}

function send(res, status, headers, body) {
  res.writeHead(status, { ...SECURITY_HEADERS, ...headers });
  res.end(body);
}

function createServer({ logger = () => {} } = {}) {
  return http.createServer((req, res) => {
    // HU-10: registro de cada petición con método, ruta y código de estado
    res.on('finish', () => {
      logger(`${req.method} ${req.url} ${res.statusCode}`);
    });

    const { pathname, searchParams } = new URL(req.url, 'http://localhost');

    if (pathname === '/health') {
      return send(res, 200, { 'Content-Type': MIME_TYPES['.json'] }, JSON.stringify({ status: 'ok' }));
    }

    if (pathname === '/api/temperatura') {
      const fahrenheit = celsiusAFahrenheit(searchParams.get('celsius'));
      const ok = fahrenheit !== null;
      const payload = ok ? { fahrenheit } : { error: 'Temperatura inválida' };
      return send(res, ok ? 200 : 400, { 'Content-Type': MIME_TYPES['.json'] }, JSON.stringify(payload));
    }

    const relative = pathname === '/' ? 'index.html' : pathname;
    const filePath = path.join(PUBLIC_DIR, path.normalize(relative));

    if (!filePath.startsWith(PUBLIC_DIR + path.sep)) {
      return send(res, 403, { 'Content-Type': 'text/plain; charset=utf-8' }, 'Forbidden');
    }

    fs.readFile(filePath, (err, content) => {
      if (err) {
        // Respuesta genérica: sin detalles técnicos ni trazas
        return send(res, 404, { 'Content-Type': 'text/plain; charset=utf-8' }, 'Not found');
      }
      const type = MIME_TYPES[path.extname(filePath)] || 'application/octet-stream';
      send(res, 200, { 'Content-Type': type }, content);
    });
  });
}

if (require.main === module) {
  createServer({ logger: console.log }).listen(PORT, () => {
    console.log(`Servidor en http://localhost:${PORT}`);
  });
}

module.exports = { createServer, celsiusAFahrenheit, SECURITY_HEADERS };
