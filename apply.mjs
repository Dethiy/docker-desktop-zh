// 把 inject.js 注入到 Docker Desktop 的界面进程里
// 用法: node apply.mjs [inject.js 路径] [--port 9333]
import fs from 'node:fs';

const port = (() => {
  const i = process.argv.indexOf('--port');
  return i > -1 ? process.argv[i + 1] : '9333';
})();
const injectPath = process.argv[2] && !process.argv[2].startsWith('--')
  ? process.argv[2]
  : new URL('./inject.js', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');

const code = fs.readFileSync(injectPath, 'utf8');

async function pageTargets() {
  const res = await fetch(`http://127.0.0.1:${port}/json/list`);
  return (await res.json()).filter((t) => t.type === 'page');
}

function evaluate(ws, expression, id) {
  return new Promise((resolve, reject) => {
    const onMessage = (ev) => {
      let msg;
      try { msg = JSON.parse(ev.data); } catch { return; }
      if (msg.id !== id) return;
      ws.removeEventListener('message', onMessage);
      if (msg.error) reject(new Error(JSON.stringify(msg.error)));
      else resolve(msg.result);
    };
    ws.addEventListener('message', onMessage);
    ws.send(JSON.stringify({ id, method: 'Runtime.evaluate', params: { expression, returnByValue: true, awaitPromise: true } }));
    setTimeout(() => reject(new Error('注入超时')), 30000);
  });
}

const targets = await pageTargets();
const target = targets.find((t) => /app:|dashboard/i.test(t.url)) || targets[0];
if (!target) { console.error('没有可注入的页面'); process.exit(1); }

const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((res, rej) => {
  ws.addEventListener('open', res);
  ws.addEventListener('error', () => rej(new Error('连接调试端口失败')));
});
const r = await evaluate(ws, code, 1);
if (r.exceptionDetails) {
  console.error('页面内异常: ' + JSON.stringify(r.exceptionDetails).slice(0, 500));
  process.exitCode = 1;
} else {
  console.log(String(r.result && r.result.value));
}
ws.close();
