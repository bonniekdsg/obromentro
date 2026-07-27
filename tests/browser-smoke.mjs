import assert from 'node:assert/strict';

const targets = await fetch('http://127.0.0.1:9224/json/list').then((response) => response.json());
const target = targets.find((item) => item.type === 'page');
const socket = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolve, reject) => {
  socket.addEventListener('open', resolve, { once: true });
  socket.addEventListener('error', reject, { once: true });
});

let nextId = 0;
const pending = new Map();
const runtimeErrors = [];

socket.addEventListener('message', (event) => {
  const message = JSON.parse(event.data);
  if (message.method === 'Runtime.exceptionThrown') runtimeErrors.push(message.params.exceptionDetails.text);
  if (!message.id || !pending.has(message.id)) return;
  const request = pending.get(message.id);
  pending.delete(message.id);
  if (message.error) request.reject(new Error(message.error.message));
  else request.resolve(message.result);
});

function call(method, params = {}) {
  const id = ++nextId;
  socket.send(JSON.stringify({ id, method, params }));
  return new Promise((resolve, reject) => pending.set(id, { resolve, reject }));
}

async function evaluate(expression) {
  const result = await call('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.text);
  return result.result.value;
}

async function inspect(path, width, expected) {
  await call('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile: width < 600 });
  await call('Page.navigate', { url: `http://127.0.0.1:4173/${path}` });
  await new Promise((resolve) => setTimeout(resolve, 900));
  const result = await evaluate(`(() => ({
    title: document.title,
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    logoLoaded: document.querySelector('.brand img')?.naturalWidth > 0,
    kpis: document.querySelectorAll('.kpi-card').length,
    rings: document.querySelectorAll('.progress-ring').length,
    scheduleRows: document.querySelectorAll('#schedule-table-body tr').length,
    ganttBars: document.querySelectorAll('.gantt-bar').length,
    financeKpis: document.querySelectorAll('.finance-kpi').length,
    budgetTables: document.querySelectorAll('.budget-card').length,
    carouselSlides: document.querySelectorAll('.carousel-slide').length,
    carouselDots: document.querySelectorAll('.carousel-dot').length,
    mobileMenuVisible: getComputedStyle(document.querySelector('.menu-button')).display !== 'none'
  }))()`);

  assert.equal(result.logoLoaded, true, `${path}: o logo deve carregar`);
  assert.ok(result.overflow <= 1, `${path} em ${width}px não deve ter overflow horizontal (encontrado ${result.overflow}px)`);
  for (const [key, value] of Object.entries(expected)) assert.equal(result[key], value, `${path}: ${key}`);
  return result;
}

await call('Page.enable');
await call('Runtime.enable');

console.log(await inspect('index.html', 1440, { kpis: 3, rings: 5, carouselSlides: 6, carouselDots: 4, mobileMenuVisible: false }));
console.log(await inspect('cronograma.html', 1440, { scheduleRows: 22, ganttBars: 5, mobileMenuVisible: false }));
console.log(await inspect('financeiro.html', 1440, { financeKpis: 3, budgetTables: 2, mobileMenuVisible: false }));
console.log(await inspect('index.html', 390, { kpis: 3, rings: 5, carouselSlides: 6, carouselDots: 4, mobileMenuVisible: true }));

await evaluate("document.querySelectorAll('.carousel-dot')[3].click(); true");
await new Promise((resolve) => setTimeout(resolve, 750));
await evaluate("document.querySelector('.carousel-arrow--next').click(); true");
await new Promise((resolve) => setTimeout(resolve, 750));
assert.equal(await evaluate("document.querySelector('#carousel-counter').textContent"), '1 / 4', 'o carrossel deve retornar à primeira imagem após a última');

assert.deepEqual(runtimeErrors, [], `erros de JavaScript encontrados: ${runtimeErrors.join(', ')}`);
socket.close();
console.log('Smoke test concluído nas três páginas e em viewport mobile.');
