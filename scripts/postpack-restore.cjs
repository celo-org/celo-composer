#!/usr/bin/env node
/* eslint-disable no-console */
const fs = require('fs-extra');
const path = require('path');
const os = require('os');
const crypto = require('crypto');

const ROOT = path.join(__dirname, '..');
const TEMPLATE_PATH = path.join(ROOT, 'templates', 'ai', 'chat-template');

// Must match prepack-prune.cjs exactly — same derivation, no shared state.
const STASH_KEY = crypto.createHash('sha256').update(ROOT).digest('hex').slice(0, 12);
const STASH_DIR = path.join(os.tmpdir(), `celo-composer-prune-${STASH_KEY}`);

// Where the stash used to live, inside the packed tree. Cleaned up if an older
// version of these scripts left one behind, so a stale directory cannot be
// picked up by a later pack.
const LEGACY_STASH_DIR = path.join(TEMPLATE_PATH, '.prune-stash');

(async () => {
  try {
    if (await fs.pathExists(LEGACY_STASH_DIR)) {
      const legacyManifest = path.join(LEGACY_STASH_DIR, 'manifest.json');
      if (await fs.pathExists(legacyManifest)) {
        for (const item of await fs.readJson(legacyManifest)) {
          const destPath = path.join(TEMPLATE_PATH, item.rel);
          if (await fs.pathExists(item.dest)) {
            await fs.ensureDir(path.dirname(destPath));
            await fs.move(item.dest, destPath, { overwrite: true });
            console.log(`[postpack] restored ${item.rel} from the legacy stash`);
          }
        }
      }
      await fs.remove(LEGACY_STASH_DIR);
    }

    if (!(await fs.pathExists(STASH_DIR))) return;
    const manifestPath = path.join(STASH_DIR, 'manifest.json');
    if (!(await fs.pathExists(manifestPath))) return;
    const manifest = await fs.readJson(manifestPath);
    for (const item of manifest) {
      const destPath = path.join(TEMPLATE_PATH, item.rel);
      await fs.ensureDir(path.dirname(destPath));
      await fs.move(item.dest, destPath, { overwrite: true });
      console.log(`[postpack] restored ${item.rel}`);
    }
    await fs.remove(STASH_DIR);
  } catch (err) {
    // Loud, because the working tree is now missing whatever was stashed. The
    // stash directory is printed so it can be restored by hand.
    console.error(`[postpack] restore FAILED — files are still in ${STASH_DIR}:`, err);
    process.exitCode = 1;
  }
})();
