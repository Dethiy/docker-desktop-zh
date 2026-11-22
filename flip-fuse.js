const fs = require('node:fs');
const path = require('node:path');
const { flipFuses, getCurrentFuseWire, FuseVersion, FuseV1Options } = require('@electron/fuses');

const exe = process.argv[2];
const backupDir = process.argv[3];

fs.mkdirSync(backupDir, { recursive: true });
const bak = path.join(backupDir, 'Docker Desktop.exe.orig');
if (!fs.existsSync(bak)) {
  fs.copyFileSync(exe, bak);
  console.log('backup ->', bak);
}

(async () => {
  const before = await getCurrentFuseWire(exe);
  console.log('before:', JSON.stringify(before, (k, v) => (typeof v === 'function' ? undefined : v)));
  await flipFuses(exe, {
    version: FuseVersion.V1,
    [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: false,
  });
  const after = await getCurrentFuseWire(exe);
  console.log('after :', JSON.stringify(after, (k, v) => (typeof v === 'function' ? undefined : v)));
})().catch((e) => {
  console.error('FAILED:', e.message);
  process.exit(1);
});
