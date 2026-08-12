#!/usr/bin/env node
/* eslint-disable no-console */
const fs = require('fs-extra');
const path = require('path');
const os = require('os');
const crypto = require('crypto');

const ROOT = path.join(__dirname, '..');
const TEMPLATE_PATH = path.join(ROOT, 'templates', 'ai', 'chat-template');

// OUTSIDE the package root, deliberately.
//
// This used to stash into templates/ai/chat-template/.prune-stash — a directory
// inside the tree being packed. `templates` is in the package `files` list, and
// npm's implicit ignores only cover some of these names at depth, so `.next` and
// tsconfig.tsbuildinfo were re-entering the tarball under .prune-stash/ and
// whether a stashed .env leaked depended on the package manager version. The
// prune achieved the opposite of its purpose.
//
// Keyed on ROOT so two checkouts packing at once cannot collide, and derived the
// same way in postpack-restore.cjs — the two must agree without passing state.
const STASH_KEY = crypto.createHash('sha256').update(ROOT).digest('hex').slice(0, 12);
const STASH_DIR = path.join(os.tmpdir(), `celo-composer-prune-${STASH_KEY}`);

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
        const dest = path.join(STASH_DIR, rel.replace(/[/]/g, '__')); // flatten
        await fs.move(src, dest, { overwrite: true });
        manifest.push({ rel, dest });
        console.log(`[prepack] pruned ${rel}`);
      }
    }
    await fs.writeJson(path.join(STASH_DIR, 'manifest.json'), manifest, {
      spaces: 2,
    });
  } catch (err) {
    // NOT "continuing". This step exists to keep .env and .env.local out of a
    // published tarball; a warning that scrolls past means the next thing that
    // happens is a publish containing them. Better to fail the pack.
    console.error('[prepack] prune step FAILED — refusing to pack:', err);
    process.exitCode = 1;
  }
})();
