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
  // At runtime, we're in dist/, so go up to package root, then into templates/
  // During development, we might be in src/, so handle both cases - (added currentDir.includes('\\dist') || to also handle Windows paths)
  const isInDist = currentDir.includes('/dist') || currentDir.includes('\\dist') || currentDir.endsWith('/dist') || currentDir.includes('\\dist') ;
  let templatesPath: string;

  if (isInDist) {
    // From dist/generators/ or dist/utils/ go up to package root, then into templates/
    templatesPath = join(currentDir, '..', 'templates');
  } else {
    // dev mode: we might be in src or src/**
    const inSrcSubdir = currentDir.includes('/src/') || currentDir.includes('\\src\\');
    const inSrcRoot = currentDir.endsWith('/src') || currentDir.endsWith('\\src');

    if (inSrcSubdir) {
      // From src/ go up to package root, then into templates/
      // e.g. .../celo-composer/src/generators -> go up twice to reach repo root
      templatesPath = join(currentDir, '..', '..', 'templates');
    } else if (inSrcRoot) {
      // e.g. .../celo-composer/src -> go up once to reach repo root
      templatesPath = join(currentDir, '..', 'templates');
    } else {
    // Fallback: safest default, go up one level
    templatesPath = join(currentDir, '..', 'templates');
  }
}
  return templatesPath;
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
