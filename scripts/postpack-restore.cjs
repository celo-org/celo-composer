#!/usr/bin/env node
/* eslint-disable no-console */
const fs = require('fs-extra');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const TEMPLATE_PATH = path.join(ROOT, 'templates', 'ai', 'chat-template');
const STASH_DIR = path.join(TEMPLATE_PATH, '.prune-stash');

(async () => {
  try {
    if (!(await fs.pathExists(STASH_DIR))) return;
    const manifestPath = path.join(STASH_DIR, 'manifest.json');
    if (!(await fs.pathExists(manifestPath))) return;
    const manifest = await fs.readJson(manifestPath);
    for (const item of manifest) {
      const destRel = item.rel;
      const destPath = path.join(TEMPLATE_PATH, destRel);
      await fs.ensureDir(path.dirname(destPath));
      await fs.move(item.dest, destPath, { overwrite: true });
      console.log(`[postpack] restored ${destRel}`);
    }
    await fs.remove(STASH_DIR);
  } catch (err) {
    console.warn('[postpack] restore step failed (continuing):', err);
  }
})();
