/**
 * Smoke tests: scaffold real projects and assert on what comes out.
 *
 * The CLI's failure mode is not a crash — it is generating a project that looks
 * fine and does not work. Every scaffold-breaking bug found in the review this
 * suite was written for was invisible to a unit test and obvious to a generated
 * project:
 *
 *   - hardhat.config.ts was not valid TypeScript, so every hardhat scaffold
 *     failed on any task (#399)
 *   - the navbar imported a component nothing wrote (#396, #403)
 *   - package.json shipped a duplicate dependency key (#400)
 *   - ai-chat could not be scaffolded at all (#387)
 *
 * So these tests run the CLI, not its parts. They deliberately do NOT install
 * dependencies: that takes minutes per combination, and the bugs above are all
 * visible without it. What that costs is type resolution — a missing import
 * cannot be distinguished from an uninstalled one — so the TypeScript check
 * below looks only at SYNTAX errors (TS1xxx), which need no node_modules.
 */

import { execFileSync } from "child_process";
import { mkdtempSync, rmSync, existsSync, readFileSync, readdirSync, statSync } from "fs";
import { tmpdir } from "os";
import { join, resolve } from "path";

// __dirname, not import.meta: ts-jest compiles these to CJS, matching how
// template-wiring.test.ts resolves the same path.
const REPO_ROOT = resolve(__dirname, "..", "..");
const CLI = join(REPO_ROOT, "dist", "index.js");

let workdir: string;

beforeAll(() => {
  // dist/ is what users run, so that is what gets tested.
  execFileSync("npm", ["run", "build"], { cwd: REPO_ROOT, stdio: "pipe" });
  workdir = mkdtempSync(join(tmpdir(), "celo-composer-smoke-"));
});

afterAll(() => {
  if (workdir) rmSync(workdir, { recursive: true, force: true });
});

function scaffold(name: string, args: string[]): string {
  execFileSync("node", [CLI, "create", name, ...args, "--skip-install", "-y"], {
    cwd: workdir,
    stdio: "pipe",
  });
  return join(workdir, name);
}

/** Every .ts/.tsx file under a directory, ignoring anything vendored. */
function typescriptFiles(root: string): string[] {
  const out: string[] = [];
  const walk = (dir: string): void => {
    for (const entry of readdirSync(dir)) {
      if (entry === "node_modules" || entry === ".git" || entry === ".next") continue;
      const full = join(dir, entry);
      if (statSync(full).isDirectory()) walk(full);
      else if (/\.tsx?$/.test(entry)) out.push(full);
    }
  };
  walk(root);
  return out;
}

/**
 * Syntax errors only. Without node_modules every import is unresolved, so
 * TS2307 and friends say nothing — but TS1xxx means the file does not parse,
 * which is a template bug every time.
 */
function syntaxErrors(projectPath: string): string[] {
  const files = typescriptFiles(projectPath);
  if (files.length === 0) return [];
  try {
    execFileSync("npx", ["tsc", "--noEmit", "--skipLibCheck", "--target", "es2022",
      "--module", "esnext", "--moduleResolution", "bundler", "--jsx", "preserve", ...files],
      { cwd: projectPath, stdio: "pipe" });
    return [];
  } catch (err) {
    const output = String((err as { stdout?: Buffer }).stdout ?? "");
    return output.split("\n").filter((line) => /error TS1\d{3}:/.test(line));
  }
}

/**
 * Combinations this suite currently catches as broken on `main`, each with the
 * PR that fixes it. Written as `it.failing`, which passes while the bug exists
 * and FAILS once it is fixed — so the marker removes itself rather than
 * quietly outliving the bug.
 *
 * That this list is not empty is the point: every entry is a real defect this
 * suite would have caught before release.
 */
const KNOWN_BROKEN: Record<string, string> = {
  "-t ai-chat": "#387 — templates/ resolves to dist/templates, so ai-chat cannot scaffold (fix: #436)",
  "duplicate-deps": "#400 / #429 — react-query, viem and wagmi declared twice (fix: #428, plus #429 filed)",
  "-t basic": "#396 — navbar imports ConnectButton; the file exports WalletConnectButton (fix: #397)",
  "-t basic --wallet-provider thirdweb": "#396 — same (fix: #397)",
  "-t basic -c foundry": "#396 — same (fix: #397)",
};

const COMBINATIONS = [
  { name: "smoke-basic", args: ["-t", "basic"] },
  { name: "smoke-basic-thirdweb", args: ["-t", "basic", "--wallet-provider", "thirdweb"] },
  { name: "smoke-basic-none", args: ["-t", "basic", "--wallet-provider", "none", "-c", "none"] },
  { name: "smoke-foundry", args: ["-t", "basic", "-c", "foundry"] },
  { name: "smoke-minipay", args: ["-t", "minipay"] },
  { name: "smoke-farcaster", args: ["-t", "farcaster-miniapp"] },
  { name: "smoke-aichat", args: ["-t", "ai-chat"] },
];

describe("every documented combination scaffolds and parses", () => {
  for (const { name, args } of COMBINATIONS) {
    const label = args.join(" ");
    const runner = KNOWN_BROKEN[label] && label === "-t ai-chat" ? it.failing : it;
    runner(label, () => {
      const path = scaffold(name, args);
      expect(existsSync(join(path, "package.json"))).toBe(true);

      const errors = syntaxErrors(path);
      expect(errors).toEqual([]);
    });
  }
});

describe("generated manifests are well formed", () => {
  it.failing("no package.json declares the same dependency twice", () => {
    // JSON.parse keeps the last duplicate, so a doubled key is silent — one
    // version string is simply discarded. #400 shipped that way.
    const path = scaffold("smoke-manifests", ["-t", "farcaster-miniapp", "--wallet-provider", "rainbowkit"]);
    const manifests = [join(path, "package.json"), join(path, "apps", "web", "package.json")]
      .filter(existsSync);
    expect(manifests.length).toBeGreaterThan(0);

    for (const file of manifests) {
      const raw = readFileSync(file, "utf8");
      const keys = [...raw.matchAll(/^\s{4}"([^"]+)":/gm)].map((m) => m[1]);
      const duplicates = keys.filter((k, i) => keys.indexOf(k) !== i);
      expect({ file, duplicates }).toEqual({ file, duplicates: [] });
    }
  });
});

describe("components the templates import are actually written", () => {
  for (const { name, args } of COMBINATIONS) {
    const label = args.join(" ");
    const runner = KNOWN_BROKEN[label] && label !== "-t ai-chat" ? it.failing : it;
    runner(`${label} imports only components that exist and export the name used`, () => {
      const path = join(workdir, name);
      const webSrc = join(path, "apps", "web", "src");
      if (!existsSync(webSrc)) return; // ai-chat is a flat app, nothing to check here

      // A navbar importing a connect-button nothing generates, or importing a
      // name the target does not export, is the exact shape of #396 and #403:
      // it reads fine in review and fails to compile. Checking the file exists
      // is not enough — in #396 the file existed and exported a DIFFERENT name.
      for (const file of typescriptFiles(webSrc)) {
        const source = readFileSync(file, "utf8");
        for (const match of source.matchAll(
          /import\s+\{([^}]+)\}\s+from\s+["']@\/components\/([\w-]+)["']/g
        )) {
          const names = match[1].split(",").map((n) => n.trim().split(/\s+as\s+/)[0]).filter(Boolean);
          const target = join(webSrc, "components", `${match[2]}.tsx`);
          expect({ file, module: match[2], exists: existsSync(target) })
            .toEqual({ file, module: match[2], exists: true });

          const targetSource = readFileSync(target, "utf8");
          for (const name of names) {
            const exported = new RegExp(
              `export\\s+(?:async\\s+)?(?:function|const|class)\\s+${name}\\b|export\\s*\\{[^}]*\\b${name}\\b`
            ).test(targetSource);
            expect({ file, imported: name, from: match[2], exported })
              .toEqual({ file, imported: name, from: match[2], exported: true });
          }
        }
      }
    });
  }
});
