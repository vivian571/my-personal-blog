#!/usr/bin/env node
const chokidar = require('chokidar');
const { exec } = require('child_process');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');

let timer = null;
let busy = false;

function run(cmd, opts = {}) {
  return new Promise((resolve, reject) => {
    exec(cmd, { cwd: repoRoot, maxBuffer: 1024 * 1024, ...opts }, (err, stdout, stderr) => {
      if (err) return reject({ err, stdout, stderr });
      resolve({ stdout, stderr });
    });
  });
}

async function checkAndPush() {
  if (busy) return;
  busy = true;
  try {
    console.log('[auto-push] Running `npm run lint`...');
    await run('npm run lint');
  } catch (e) {
    console.error('[auto-push] Lint failed — aborting push.');
    busy = false;
    return;
  }

  try {
    console.log('[auto-push] Running `npm run build`...');
    await run('npm run build');
  } catch (e) {
    console.error('[auto-push] Build failed — aborting push.');
    busy = false;
    return;
  }

  try {
    const { stdout } = await run('git status --porcelain');
    if (!stdout.trim()) {
      console.log('[auto-push] No changes to commit.');
      busy = false;
      return;
    }
    await run('git add -A');
    const timestamp = new Date().toISOString();
    const { stdout: branchOut } = await run('git rev-parse --abbrev-ref HEAD');
    const branch = branchOut.trim();
    await run(`git commit -m "Auto update on ${timestamp} [${branch}]"`);
    console.log('[auto-push] Pushing to remote...');
    await run('git push');
    console.log('[auto-push] Push complete.');
  } catch (e) {
    console.error('[auto-push] Git error:', e.stderr || e.err || e);
  } finally {
    busy = false;
  }
}

const watcher = chokidar.watch(['.'], {
  ignored: /(^|[\/\\])\.(git|node_modules)|\.next|\.vercel|public/,
  ignoreInitial: true,
  cwd: repoRoot,
  usePolling: true,
  interval: 100
});

watcher.on('all', (event, changedPath) => {
  console.log(`[auto-push] Detected ${event}: ${changedPath}`);
  if (timer) clearTimeout(timer);
  timer = setTimeout(checkAndPush, 2000);
});

console.log('[auto-push] Watcher started. Listening for file changes...');
