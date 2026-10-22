const test = require('node:test');
const assert = require('node:assert');
const { createServer, celsiusAFahrenheit } = require('../src/server');

function withServer(fn) {
  return new Promise((resolve, reject) => {
    const server = createServer().listen(0, async () => {
      try {
        await fn(`http://localhost:${server.address().port}`);
        resolve();
      } catch (e) {
        reject(e);
      } finally {
        server.close();
      }
    });
  });
}

test('celsiusAFahrenheit convierte valores conocidos', () => {
  assert.strictEqual(celsiusAFahrenheit('0'), 32);
  assert.strictEqual(celsiusAFahrenheit('100'), 212);
  assert.strictEqual(celsiusAFahrenheit('-40'), -40);
  assert.strictEqual(celsiusAFahrenheit('36.6'), 97.88);
});

test('celsiusAFahrenheit rechaza entradas inválidas y bajo el cero absoluto', () => {
  for (const bad of [null, undefined, '', 'abc', '1e3', 'Infinity', '1,5', '1234567', '-300', '-273.16', '1; DROP']) {
    assert.strictEqual(celsiusAFahrenheit(bad), null, `debía rechazar ${JSON.stringify(bad)}`);
  }
  assert.strictEqual(celsiusAFahrenheit('-273.15'), -459.67);
});

test('GET /api/temperatura responde 200 con el resultado', () =>
  withServer(async (base) => {
    const res = await fetch(`${base}/api/temperatura?celsius=25`);
    assert.strictEqual(res.status, 200);
    assert.deepStrictEqual(await res.json(), { fahrenheit: 77 });
  }));

test('GET /api/temperatura responde 400 con parámetro faltante o inválido', () =>
  withServer(async (base) => {
    for (const q of ['', '?celsius=', '?celsius=hot', '?celsius=-500']) {
      const res = await fetch(`${base}/api/temperatura${q}`);
      assert.strictEqual(res.status, 400);
      assert.deepStrictEqual(await res.json(), { error: 'Temperatura inválida' });
    }
  }));

test('/api/temperatura incluye cabeceras de seguridad', () =>
  withServer(async (base) => {
    const res = await fetch(`${base}/api/temperatura?celsius=1`);
    assert.strictEqual(res.headers.get('x-content-type-options'), 'nosniff');
  }));
