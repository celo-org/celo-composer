/**
 * Two things conspired to leave a scaffolded app on a version with an
 * unauthenticated RCE (#458).
 *
 * The first is that the fix for a Next.js advisory does not always exist on the
 * line a template pins. `next: ^14.0.0` looks like a range that can receive
 * patches, and for most advisories it can — but GHSA-2xp9-vwfh-vxw4 is
 * vulnerable from 10.0.0 and first patched in 15.5.24, so no 14.x release fixes
 * it. A range is not a safety property; only a floor is.
 *
 * The second is that `templates/base/apps/web/package.json.hbs` is not named
 * `package.json`, so no scanner reads it. Dependabot had twenty-odd alerts open
 * against the chat template's real manifest and none against the Handlebars one,
 * while both declared a vulnerable `next` (#470).
 *
 * So this suite asserts the floor over *every* manifest the repo ships,
 * Handlebars included, and then again over the manifest a user actually
 * receives — which is the only one that is really the product.
 */

import { spawnSync } from "child_process";
import fs from "fs-extra";
import os from "os";
import path from "path";

const repoRoot = path.resolve(__dirname, "..", "..");

/**
 * The lowest `next` we are allowed to ship.
 *
 * GHSA-2xp9-vwfh-vxw4 — unauthenticated RCE in the Image Optimization API when
 * AVIF files are used — is vulnerable `>= 10.0.0, < 15.5.24`, and
 * GHSA-p293-qw3h-jr36 (CVE-2026-75604) is vulnerable `>= 13.4.0, < 15.5.24`.
 * Both first patched in 15.5.24.
 *
 * Pinned here rather than written in a comment next to each manifest, so that
 * raising it is one edit and every manifest is re-checked against it.
 */
const NEXT_FLOOR = "15.5.24";

/** `^15.5.25` and `15.5.25` both mean "15.5.25 is the lowest we could get". */
function lowestAllowed(range: string): number[] {
  const cleaned = range.trim().replace(/^[\^~>=\s]+/, "");
  const parts = cleaned.split(".").map((n) => parseInt(n, 10));
  if (parts.length !== 3 || parts.some(Number.isNaN)) {
    throw new Error(
      `Cannot read a floor out of the version range "${range}". ` +
        `This test only understands exact pins and caret/tilde ranges; if a ` +
        `manifest now uses something else, teach it that shape rather than ` +
        `dropping the manifest from the sweep.`
    );
  }
  return parts;
}

function isAtLeastFloor(range: string): boolean {
  const got = lowestAllowed(range);
  const floor = lowestAllowed(NEXT_FLOOR);
  for (let i = 0; i < 3; i++) {
    if (got[i] > floor[i]) return true;
    if (got[i] < floor[i]) return false;
  }
  return true;
}

/**
 * Every file under templates/ that declares `next`, whether or not a scanner
 * would recognise it as a manifest. Discovered rather than listed: a new
 * template that pins its own `next` has to be caught without anyone
 * remembering to add it here.
 */
function manifestsDeclaringNext(): string[] {
  const found: string[] = [];
  const walk = (dir: string): void => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name === "node_modules" || entry.name === ".next") continue;
        walk(full);
        continue;
      }
      if (entry.name !== "package.json" && entry.name !== "package.json.hbs") continue;
      if (/"next"\s*:/.test(fs.readFileSync(full, "utf8"))) found.push(full);
    }
  };
  walk(path.join(repoRoot, "templates"));
  return found.sort();
}

/**
 * The `.hbs` manifests are not JSON — the dependency block is interrupted by
 * `{{#if (or (eq walletProvider "rainbowkit") ...)}}` conditionals — so they
 * cannot be parsed and have to be read by line.
 */
function declaredNextRange(manifestPath: string): string {
  const source = fs.readFileSync(manifestPath, "utf8");
  const match = source.match(/"next"\s*:\s*"([^"]+)"/);
  if (!match) throw new Error(`No "next" declaration in ${manifestPath}`);
  return match[1];
}

describe("every template manifest, scannable or not, clears the Next.js advisory floor", () => {
  const manifests = manifestsDeclaringNext();

  it("finds the manifests to check at all", () => {
    // A discovery bug would make every assertion below vacuously pass.
    expect(manifests.length).toBeGreaterThan(0);
    // Specifically: the Handlebars one, which is the whole reason this exists.
    expect(manifests.some((m) => m.endsWith("package.json.hbs"))).toBe(true);
  });

  it.each(manifestsDeclaringNext().map((m) => path.relative(repoRoot, m)))(
    "%s declares next >= " + NEXT_FLOOR,
    (relative) => {
      const range = declaredNextRange(path.join(repoRoot, relative));
      expect({ manifest: relative, next: range, atLeast: isAtLeastFloor(range) }).toEqual({
        manifest: relative,
        next: range,
        atLeast: true,
      });
    }
  );

  it("keeps eslint-config-next in step with next", () => {
    // Not cosmetic: the lint config and the framework share a version line, and
    // a mismatched pair is how a template ends up linting against rules for a
    // Next it is not running.
    for (const manifest of manifests) {
      const source = fs.readFileSync(manifest, "utf8");
      const eslintConfig = source.match(/"eslint-config-next"\s*:\s*"([^"]+)"/);
      if (!eslintConfig) continue;
      expect({
        manifest: path.relative(repoRoot, manifest),
        eslintConfigNext: eslintConfig[1],
        matchesNext: eslintConfig[1] === declaredNextRange(manifest),
      }).toEqual({
        manifest: path.relative(repoRoot, manifest),
        eslintConfigNext: eslintConfig[1],
        matchesNext: true,
      });
    }
  });
});

/**
 * The generated output is the product. The base manifest is Handlebars, so the
 * range a user ends up with is the range after rendering — assert on that
 * rather than trusting that the template read the way it looked.
 */
describe("a scaffolded project ships a patched next", () => {
  let projectPath: string;

  beforeAll(() => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), "composer-floor-"));
    const run = spawnSync(
      path.join(repoRoot, "node_modules", ".bin", "tsx"),
      [
        path.join(repoRoot, "src", "index.ts"),
        "create",
        "floor-fixture",
        "-t",
        "basic",
        "--skip-install",
        "-y",
      ],
      { cwd: root, encoding: "utf8" }
    );
    if (run.status !== 0) {
      throw new Error(`create -t basic exited ${run.status}\n${run.stderr}`);
    }
    projectPath = path.join(root, "floor-fixture");
  });

  afterAll(() => {
    if (projectPath) fs.removeSync(path.dirname(projectPath));
  });

  it("declares next >= " + NEXT_FLOOR + " in the rendered apps/web manifest", () => {
    const pkg = fs.readJsonSync(path.join(projectPath, "apps/web/package.json"));
    expect({ next: pkg.dependencies.next, atLeast: isAtLeastFloor(pkg.dependencies.next) })
      .toEqual({ next: pkg.dependencies.next, atLeast: true });
  });

  it("still renders valid JSON around the conditional wallet blocks", () => {
    // The control. Editing a dependency line in a .hbs manifest is exactly how
    // you produce a file that reads fine and parses as nothing — and
    // readJsonSync above would be the only thing that noticed.
    const pkg = fs.readJsonSync(path.join(projectPath, "apps/web/package.json"));
    expect(pkg.dependencies.react).toBeDefined();
    expect(pkg.dependencies["react-dom"]).toBeDefined();
  });
});
