import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const targets = await fetch('http://127.0.0.1:9223/json/list').then((response) => response.json());
const pageTarget = targets.find((target) => target.type === 'page');
const socket = new WebSocket(pageTarget.webSocketDebuggerUrl);
await new Promise((resolveOpen, reject) => {
  socket.addEventListener('open', resolveOpen, { once: true });
  socket.addEventListener('error', reject, { once: true });
});

let nextId = 0;
const pending = new Map();
socket.addEventListener('message', (event) => {
  const message = JSON.parse(event.data);
  if (!message.id || !pending.has(message.id)) return;
  const { resolve: resolveCall, reject } = pending.get(message.id);
  pending.delete(message.id);
  if (message.error) reject(new Error(message.error.message));
  else resolveCall(message.result);
});

function call(method, params = {}) {
  const id = ++nextId;
  socket.send(JSON.stringify({ id, method, params }));
  return new Promise((resolveCall, reject) => pending.set(id, { resolve: resolveCall, reject }));
}

await call('Page.enable');
await call('Runtime.enable');
await call('Page.navigate', { url: 'http://127.0.0.1:4173/index.html' });
await new Promise((resolveWait) => setTimeout(resolveWait, 1000));

const stems = [
  'render-01-praca-civica',
  'render-02-fachada-principal',
  'render-03-conjunto-entardecer',
  'render-04-praca-aerea'
];

for (const stem of stems) {
  for (const width of [640, 1280, 1672]) {
    const expression = `(async () => {
      const image = new Image();
      image.src = new URL('assets/renders/${stem}.png', location.href).href;
      await image.decode();
      const canvas = document.createElement('canvas');
      canvas.width = ${width};
      canvas.height = Math.round(image.naturalHeight * ${width} / image.naturalWidth);
      canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);
      return canvas.toDataURL('image/webp', .72).split(',')[1];
    })()`;
    const result = await call('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
    const buffer = Buffer.from(result.result.value, 'base64');
    await writeFile(resolve(`assets/renders/${stem}-${width}.webp`), buffer);
    console.log(`${stem}-${width}.webp · ${Math.round(buffer.length / 1024)} KB`);
  }
}

socket.close();
