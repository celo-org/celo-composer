import fs from "fs-extra";
import path from "path";

export const safeCopyTemplate = async (
  sourcePath: string,
  destPath: string
): Promise<void> => {
  const excludedTopDirs = new Set([".git", ".next", "node_modules", "docs"]);
  const excludedFiles = new Set(["tsconfig.tsbuildinfo", ".env", ".env.local"]);

  const filter = (src: string): boolean => {
    const rel = path.relative(sourcePath, src);
    if (!rel) return true; // root

    const parts = rel.split(path.sep);
    const top = parts[0];
    if (excludedTopDirs.has(top)) return false;

    const base = path.basename(src);
    if (excludedFiles.has(base)) return false;

    return true;
  };

  await fs.copy(sourcePath, destPath, { filter });
};
