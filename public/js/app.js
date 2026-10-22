async function loadStatus() {
  const el = document.getElementById('status');
  try {
    const res = await fetch('/health');
    const data = await res.json();
    el.textContent = `Servidor: ${data.status}`;
  } catch {
    el.textContent = 'Servidor: sin conexión';
  }
}

loadStatus();
