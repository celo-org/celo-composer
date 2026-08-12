import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs'; // new for dist detection

/**
 * Get the directory name of the current module (ESM equivalent of __dirname)
 */
export function getDirname(importMetaUrl: string): string {
  return dirname(fileURLToPath(importMetaUrl));
}

/**
 * Get the templates directory path from any source file
 */
export function getTemplatesPath(importMetaUrl: string): string {
  const currentDir = getDirname(importMetaUrl);

  // Walk up until a directory actually contains templates/, rather than
  // hardcoding how many levels up the caller happens to sit.
  //
  // This used to branch on dist-vs-src and then apply a fixed `..` for dist,
  // which is only correct for a caller at dist/ root. plopfile.js is there, so
  // it worked; plop-generator.js is at dist/generators/, so it resolved to
  // <pkg>/dist/templates — a directory that has never existed. The ai-chat
  // template is the only one that goes through that path, which is why it was
  // the only template that could not be scaffolded at all.
  //
  // Depth-independent so moving a caller cannot reintroduce it.
  let dir = currentDir;
  for (let i = 0; i < 6; i += 1) {
    const candidate = join(dir, 'templates');
    if (existsSync(candidate)) return candidate;
    const parent = dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }

  // Nothing found. Return the historically-correct guess so the caller reports
  // a missing template rather than a missing directory two levels up.
  const isInDist = currentDir.includes('/dist') || currentDir.includes('\\dist');
  return isInDist
    ? join(currentDir, '..', 'templates')
    : join(currentDir, '..', '..', 'templates');
}

/**
 * Get the plopfile path from any source file
 */
export function getPlopfilePath(importMetaUrl: string): string {
  const currentDir = getDirname(importMetaUrl);
  // At runtime, we're in dist/generators/, so go up to dist/, then to plopfile.js
  // During development, we might be in src/generators/, so handle both cases
  const isInDist = currentDir.includes('/dist') || currentDir.includes('\\dist') || currentDir.endsWith('/dist') || currentDir.endsWith('\\dist');
  if (isInDist) {
    // From dist/generators/ go up to dist/, then to plopfile.js
    const distJs = join(currentDir, '..', 'plopfile.js');
    const distTs = join(currentDir, '..', 'plopfile.ts');

    if (existsSync(distJs)) return distJs;
    if (existsSync(distTs)) return distTs;

    return distJs;
  } else {
    // From src/generators/ go up to src/, then to plopfile.ts
    const srcTs = join(currentDir, '..', 'plopfile.ts');
    const srcJs = join(currentDir, '..', 'plopfile.js');

    if (existsSync(srcTs)) return srcTs;
    if (existsSync(srcJs)) return srcJs;

    return srcTs;
  }
}
