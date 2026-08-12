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
import ts from "typescript";

// __dirname, not import.meta: ts-jest compiles these to CJS, matching how
// template-wiring.test.ts resolves the same path.
const REPO_ROOT = resolve(__dirname, "..", "..");
const CLI = join(REPO_ROOT, "dist", "index.js");

// npm ships as npm.cmd on Windows and execFileSync does not resolve the shim.
// Contributor machines are where this runs — there are no CI workflows yet.
const NPM = process.platform === "win32" ? "npm.cmd" : "npm";

let workdir: string;

beforeAll(() => {
  // dist/ is what users run, so that is what gets tested.
  execFileSync(NPM, ["run", "build"], { cwd: REPO_ROOT, stdio: "pipe" });
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
 * TS2307 and friends say nothing — but a parse error means the file is not
 * valid TypeScript, which is a template bug every time.
 *
 * Parsed in-process with the compiler this repo already depends on, rather than
 * shelling out. The earlier version ran `npx tsc` with cwd set to the scaffold,
 * and a scaffold has no node_modules — so what it actually did depended on the
 * machine, and on none of them did it check anything:
 *
 *   - with nothing named tsc reachable, npx fetched the registry's placeholder
 *     package literally called `tsc`, which prints a joke and exits 1
 *   - with a tsc on PATH, it exited on `TS5112: tsconfig.json is present but
 *     will not be loaded if files are specified on commandline`
 *
 * Both leave stderr-only output and no `error TS…` lines on stdout, so the
 * catch block filtered an empty string and returned []. The suite passed over a
 * scaffold carrying 21 real syntax errors (#399).
 *
 * `transpileModule` is the public API for this: single-file, no module
 * resolution, no config file, and it reports the same parse diagnostics.
 */
function syntaxErrors(projectPath: string): string[] {
  const out: string[] = [];
  for (const file of typescriptFiles(projectPath)) {
    const result = ts.transpileModule(readFileSync(file, "utf8"), {
      fileName: file,
      reportDiagnostics: true,
      compilerOptions: {
        target: ts.ScriptTarget.ES2022,
        module: ts.ModuleKind.ESNext,
        jsx: ts.JsxEmit.Preserve,
      },
    });
    for (const d of result.diagnostics ?? []) {
      const where = d.file && d.start !== undefined
        ? (({ line, character }) => `:${line + 1}:${character + 1}`)(
            d.file.getLineAndCharacterOfPosition(d.start)
          )
        : "";
      out.push(
        `${file.slice(projectPath.length + 1)}${where} - error TS${d.code}: ` +
          ts.flattenDiagnosticMessageText(d.messageText, " ")
      );
    }
  }
  return out;
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
type Suite = "scaffold" | "manifests" | "components";

const KNOWN_BROKEN: Array<{ suite: Suite; label: string; reason: string }> = [
  { suite: "scaffold", label: "-t ai-chat", reason: "#387 — templates/ resolves to dist/templates, so ai-chat cannot scaffold (fix: #436)" },
  // #399, found by the parse check once it actually parsed. Only the
  // combinations that ship a hardhat package are affected — verified by
  // generating all seven: basic, basic+thirdweb and minipay carry the 21
  // errors; basic+none, foundry and farcaster carry none.
  { suite: "scaffold", label: "-t basic", reason: "#399 — hardhat.config.ts has unquoted hyphenated network keys, 21 parse errors (fix: #427)" },
  { suite: "scaffold", label: "-t basic --wallet-provider thirdweb", reason: "#399 — same (fix: #427)" },
  { suite: "scaffold", label: "-t minipay", reason: "#399 — same (fix: #427)" },

  { suite: "manifests", label: "-t farcaster-miniapp --wallet-provider rainbowkit", reason: "#400 / #429 — react-query, viem and wagmi declared twice (fix: #428, #450)" },

  { suite: "components", label: "-t basic", reason: "#396 — navbar imports ConnectButton; the file exports WalletConnectButton (fix: #397)" },
  { suite: "components", label: "-t basic --wallet-provider thirdweb", reason: "#396 — same (fix: #397)" },
  { suite: "components", label: "-t basic -c foundry", reason: "#396 — same (fix: #397)" },
  { suite: "components", label: "-t minipay", reason: "#396 — navbar renders <WalletConnectButton /> with no import at all (fix: #397)" },
];

/** `it.failing` while the named bug is open, plain `it` once it is fixed. */
function runnerFor(suite: Suite, label: string) {
  return KNOWN_BROKEN.some((k) => k.suite === suite && k.label === label) ? it.failing : it;
}

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
    runnerFor("scaffold", label)(label, () => {
      const path = scaffold(name, args);
      expect(existsSync(join(path, "package.json"))).toBe(true);

      const errors = syntaxErrors(path);
      expect(errors).toEqual([]);
    });
  }
});

/**
 * Duplicate keys, counted per object rather than per indent level.
 *
 * An earlier version matched `/^\s{4}"([^"]+)":/gm`, which is blind to which
 * object a key belongs to: on a hardhat scaffold `typechain` appears once as a
 * script and once as a devDependency, four spaces in both times, and reads as a
 * duplicate. Today's manifests dodged it by coincidence.
 *
 * JSON.parse cannot be used here — it keeps the last duplicate and discards the
 * other version string silently, which is exactly the bug (#400).
 */
function duplicateKeys(raw: string): string[] {
  const dupes: string[] = [];
  const stack: Array<{ path: string; seen: Set<string> }> = [];
  let key: string | null = null;

  for (const token of raw.matchAll(/"((?:[^"\\]|\\.)*)"\s*:|[{}[\]]/g)) {
    const text = token[0];
    if (text === "{") {
      stack.push({ path: key ?? "$", seen: new Set() });
      key = null;
    } else if (text === "}") {
      stack.pop();
    } else if (text === "[" || text === "]") {
      key = null;
    } else {
      key = token[1];
      const frame = stack[stack.length - 1];
      if (frame) {
        if (frame.seen.has(key)) dupes.push(`${frame.path}.${key}`);
        frame.seen.add(key);
      }
    }
  }
  return dupes;
}

describe("generated manifests are well formed", () => {
  const label = "-t farcaster-miniapp --wallet-provider rainbowkit";
  runnerFor("manifests", label)("no object declares the same key twice", () => {
    const path = scaffold("smoke-manifests", ["-t", "farcaster-miniapp", "--wallet-provider", "rainbowkit"]);

    // Every manifest in the scaffold, not a hardcoded pair. The old list
    // happened to exclude apps/contracts, which is the one that would have
    // tripped the previous indent-based check on `typechain`.
    const manifests: string[] = [];
    const collect = (dir: string): void => {
      for (const entry of readdirSync(dir)) {
        if (entry === "node_modules" || entry === ".git" || entry === ".next") continue;
        const full = join(dir, entry);
        if (statSync(full).isDirectory()) collect(full);
        else if (entry === "package.json") manifests.push(full);
      }
    };
    collect(path);
    expect(manifests.length).toBeGreaterThan(0);

    for (const file of manifests) {
      const duplicates = duplicateKeys(readFileSync(file, "utf8"));
      expect({ file, duplicates }).toEqual({ file, duplicates: [] });
    }
  });
});

/**
 * Component names rendered as JSX that nothing in the file binds.
 *
 * The import↔export check alone cannot see this: #396's minipay navbar renders
 * `<WalletConnectButton />` with **no import statement at all**, so there is no
 * import to validate and the file sails through. Walking the AST catches the
 * shape the import check is blind to.
 */
function unresolvedJsx(file: string): string[] {
  const source = readFileSync(file, "utf8");
  const sf = ts.createSourceFile(
    file,
    source,
    ts.ScriptTarget.ES2022,
    true,
    file.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS
  );

  const bound = new Set<string>();
  const used = new Map<string, true>();

  const bind = (n: ts.Node): void => {
    if (ts.isIdentifier(n)) bound.add(n.text);
    else if (ts.isObjectBindingPattern(n) || ts.isArrayBindingPattern(n)) {
      n.elements.forEach((el) => ts.isBindingElement(el) && bind(el.name));
    }
  };

  const visit = (node: ts.Node): void => {
    if (ts.isImportDeclaration(node) && node.importClause) {
      const { name, namedBindings } = node.importClause;
      if (name) bound.add(name.text);
      if (namedBindings) {
        if (ts.isNamespaceImport(namedBindings)) bound.add(namedBindings.name.text);
        else namedBindings.elements.forEach((e) => bound.add(e.name.text));
      }
    } else if (ts.isVariableDeclaration(node) || ts.isBindingElement(node)) {
      bind(node.name);
    } else if (
      (ts.isFunctionDeclaration(node) || ts.isClassDeclaration(node) || ts.isEnumDeclaration(node)) &&
      node.name
    ) {
      bound.add(node.name.text);
    } else if (ts.isParameter(node)) {
      bind(node.name);
    } else if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
      // Leftmost identifier: <Foo.Bar /> needs `Foo` bound, not `Bar`.
      let tag: ts.Node = node.tagName;
      while (ts.isPropertyAccessExpression(tag)) tag = tag.expression;
      if (ts.isIdentifier(tag) && /^[A-Z]/.test(tag.text)) used.set(tag.text, true);
    }
    ts.forEachChild(node, visit);
  };
  visit(sf);

  return [...used.keys()].filter((n) => !bound.has(n)).sort();
}

describe("components the templates import are actually written", () => {
  for (const { name, args } of COMBINATIONS) {
    const label = args.join(" ");
    runnerFor("components", label)(`${label} renders only components it can resolve`, () => {
      const path = join(workdir, name);
      const webSrc = join(path, "apps", "web", "src");

      // Fail loudly rather than skipping. A missing directory used to make this
      // test pass silently, so a scaffold that never generated in the first
      // describe was reported as green here.
      if (label === "-t ai-chat") {
        expect(existsSync(webSrc)).toBe(false); // flat app: apps/web must NOT exist
        return;
      }
      expect({ webSrc, exists: existsSync(webSrc) }).toEqual({ webSrc, exists: true });

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

        // And the other half of #396: rendered but never bound.
        const unresolved = unresolvedJsx(file);
        expect({ file, unresolved }).toEqual({ file, unresolved: [] });
      }
    });
  }
});
