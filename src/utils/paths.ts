import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

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
  
  // Determine if we're running from dist or src
  const isInDist = currentDir.includes('/dist') || currentDir.endsWith('/dist');
  
  let templatesPath: string;
  if (isInDist) {
    // Check if we're directly in dist/ or in a subdirectory
    if (currentDir.endsWith('/dist')) {
      // From dist/ go up ONE level to package root, then into templates/
      templatesPath = join(currentDir, '..', 'templates');
    } else {
      // From dist/generators/ or dist/utils/ go up TWO levels to package root, then into templates/
      templatesPath = join(currentDir, '..', '..', 'templates');
    }
  } else {
    // From src/ or src/subdirectory/ determine how many levels to go up
    if (currentDir.endsWith('/src')) {
      // From src/ go up ONE level to package root, then into templates/
      templatesPath = join(currentDir, '..', 'templates');
    } else {
      // From src/generators/ or src/utils/ go up TWO levels to package root, then into templates/
      templatesPath = join(currentDir, '..', '..', 'templates');
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
  const isInDist = currentDir.includes('/dist') || currentDir.endsWith('/dist');
  if (isInDist) {
    // From dist/generators/ go up to dist/, then to plopfile.js (compiled)
    return join(currentDir, '..', 'plopfile.js');
  } else {
    // From src/generators/ go up to src/, then to plopfile.ts (TypeScript source)
    return join(currentDir, '..', 'plopfile.ts');
  }
}
