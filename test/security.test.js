const test = require('node:test');
const assert = require('node:assert');
const http = require('node:http');
const { createServer, SECURITY_HEADERS } = require('../src/server');

function withServer(options, fn) {
  return new Promise((resolve, reject) => {
    const server = createServer(options).listen(0, async () => {
      try {
        await fn(server.address().port);
        resolve();
      } catch (e) {
        reject(e);
      } finally {
        server.close();
      }
    });
  });
}

// http.request conserva la ruta tal cual, a diferencia de fetch que la normaliza
function rawGet(port, rawPath) {
  return new Promise((resolve, reject) => {
    http
      .get({ host: 'localhost', port, path: rawPath }, (res) => {
        let body = '';
        res.on('data', (c) => (body += c));
        res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body }));
      })
      .on('error', reject);
  });
}

function assertSecurityHeaders(headers) {
  for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
    assert.strictEqual(headers.get(name), value, `falta la cabecera ${name}`);
  }
}

test('cabeceras de seguridad en /, /health y 404', () =>
  withServer({}, async (port) => {
    for (const route of ['/', '/health', '/no-existe']) {
      const res = await fetch(`http://localhost:${port}${route}`);
      assertSecurityHeaders(res.headers);
    }
  }));

test('CSP restringe el origen y prohíbe ser embebido', () => {
  const csp = SECURITY_HEADERS['Content-Security-Policy'];
  assert.match(csp, /default-src 'self'/);
  assert.match(csp, /frame-ancestors 'none'/);
});

test('no se expone información de versión del servidor', () =>
  withServer({}, async (port) => {
    const res = await fetch(`http://localhost:${port}/health`);
    assert.strictEqual(res.headers.get('x-powered-by'), null);
    assert.strictEqual(res.headers.get('server'), null);
  }));

test('/health solo devuelve el estado, sin datos internos', () =>
  withServer({}, async (port) => {
    const res = await fetch(`http://localhost:${port}/health`);
    assert.deepStrictEqual(await res.json(), { status: 'ok' });
  }));

test('404 no incluye detalles técnicos ni trazas', () =>
  withServer({}, async (port) => {
    const res = await fetch(`http://localhost:${port}/no-existe`);
    const body = await res.text();
    assert.strictEqual(res.status, 404);
    assert.strictEqual(body, 'Not found');
    assert.doesNotMatch(body, /at .*\.js|Error|node_modules/);
  }));

test('bloquea path traversal (literal y codificado)', () =>
  withServer({}, async (port) => {
    for (const p of ['/../package.json', '/..%2fpackage.json', '/%2e%2e/package.json', '/../public-evil/x']) {
      const res = await rawGet(port, p);
      assert.ok([403, 404].includes(res.status), `${p} devolvió ${res.status}`);
      assert.doesNotMatch(res.body, /devsecops-1/);
    }
  }));

test('registra método, ruta y código de estado de cada petición', () => {
  const logs = [];
  return withServer({ logger: (line) => logs.push(line) }, async (port) => {
    await fetch(`http://localhost:${port}/health`);
    await fetch(`http://localhost:${port}/no-existe`);
    await new Promise((r) => setTimeout(r, 50));
    assert.ok(logs.includes('GET /health 200'), JSON.stringify(logs));
    assert.ok(logs.includes('GET /no-existe 404'), JSON.stringify(logs));
  });
});
