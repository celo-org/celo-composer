#!/usr/bin/env node
/* eslint-disable no-console */
const fs = require('fs-extra');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const TEMPLATE_PATH = path.join(ROOT, 'templates', 'ai', 'chat-template');
const STASH_DIR = path.join(TEMPLATE_PATH, '.prune-stash');

const pathsToPrune = [
  '.git',
  '.next',
  'node_modules',
  'tsconfig.tsbuildinfo',
  '.env',
  '.env.local',
];

(async () => {
  try {
    if (!(await fs.pathExists(TEMPLATE_PATH))) return;
    await fs.ensureDir(STASH_DIR);

    const manifest = [];
    for (const rel of pathsToPrune) {
      const src = path.join(TEMPLATE_PATH, rel);
      if (await fs.pathExists(src)) {
        const dest = path.join(STASH_DIR, rel.replace(/[\/]/g, '__')); // flatten
        await fs.move(src, dest, { overwrite: true });
        manifest.push({ rel, dest });
        console.log(`[prepack] pruned ${rel}`);
      }
    }
    await fs.writeJson(path.join(STASH_DIR, 'manifest.json'), manifest, {
      spaces: 2,
    });
  } catch (err) {
    console.warn('[prepack] prune step failed (continuing):', err);
  }
})();
