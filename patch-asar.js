// 在 app.asar 里注入中文脚本: 只加一个 cn.js 和一行 script 标签
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const asar = require('@electron/asar');

const origAsar = process.argv[2];
const outAsar = process.argv[3];
const cnJsPath = process.argv[4];

(async () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'asar-'));
  console.log('extract ->', tmp);
  await asar.extractAll(origAsar, tmp);

  const pages = ['build/desktop-ui-build/index.html', 'build/desktop-ui-2-build/index.html'];
  for (const p of pages) {
    const f = path.join(tmp, p);
    if (!fs.existsSync(f)) { console.log('skip (missing):', p); continue; }
    const dir = path.dirname(f);
    const assetsDir = path.join(dir, 'assets');
    fs.mkdirSync(assetsDir, { recursive: true });
    fs.copyFileSync(cnJsPath, path.join(assetsDir, 'cn.js'));
    let html = fs.readFileSync(f, 'utf8');
    if (!html.includes('cn.js')) {
      html = html.replace('</head>', '    <script src="/assets/cn.js"></script>\n  </head>');
      fs.writeFileSync(f, html);
    }
    console.log('patched:', p, '| assets dir has', fs.readdirSync(assetsDir).length, 'files');
  }

  await asar.createPackageWithOptions(tmp, outAsar, { unpack: '**/Release/*' });
  const st = fs.statSync(outAsar);
  console.log('packed ->', outAsar, st.size, 'bytes');
  fs.rmSync(tmp, { recursive: true, force: true });
})().catch((e) => { console.error('FAILED:', e); process.exit(1); });
