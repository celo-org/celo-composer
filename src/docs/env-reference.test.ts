/**
 * The environment variable reference in docs/cli-reference/configuration.mdx is
 * written by hand, and the templates it describes change underneath it. That is
 * how the docs came to name CELO_PROVIDER_URL, which nothing ever read (#421),
 * and to say a Foundry project generates no env file when it does.
 *
 * Each table in that page is tagged with the template file it describes:
 *
 *   {/* env-file: templates/contracts/hardhat/.env.example.hbs *\/}
 *
 * These tests hold the page to the templates in both directions: every variable
 * a template file declares is documented, every documented variable is declared,
 * every env file the templates ship has a table, and every variable the template
 * code reads is documented somewhere. They also check the Networks table against
 * the chain IDs and RPC URLs the contract configs actually use.
 */

import fs from "fs-extra";
import path from "path";

const repoRoot = path.resolve(__dirname, "..", "..");
const docPath = path.join(repoRoot, "docs", "cli-reference", "configuration.mdx");
const templatesRoot = path.join(repoRoot, "templates");

/**
 * Variables the template code reads that are not configuration a user sets:
 * test runner and framework plumbing in the ai-chat template.
 */
const TOOLING_VARS = new Set([
  "NODE_ENV",
  "CI",
  "PLAYWRIGHT",
  "PLAYWRIGHT_TEST_BASE_URL",
  "CI_PLAYWRIGHT",
]);

function readDoc(): string {
  return fs.readFileSync(docPath, "utf8");
}

/** Map of template file (repo-relative) to the variable names its table lists. */
function documentedTables(doc: string): Map<string, string[]> {
  const tables = new Map<string, string[]>();
  const marker = /\{\/\*\s*env-file:\s*(\S+)\s*\*\/\}/g;
  let match: RegExpExecArray | null;
  while ((match = marker.exec(doc)) !== null) {
    const rest = doc.slice(match.index + match[0].length);
    // The table ends at the next heading or the next marker.
    const stop = rest.search(/^#{2,3} |\{\/\*\s*env-file:/m);
    const section = stop === -1 ? rest : rest.slice(0, stop);
    const names = [...section.matchAll(/^\|\s*`([A-Z][A-Z0-9_]*)`\s*\|/gm)].map((m) => m[1]);
    tables.set(match[1], names);
  }
  return tables;
}

/** Uncommented `NAME=` lines, the way dotenv and Next.js would read them. */
function declaredVars(file: string): string[] {
  const text = fs.readFileSync(path.join(repoRoot, file), "utf8");
  return [...text.matchAll(/^([A-Z][A-Z0-9_]*)=/gm)].map((m) => m[1]);
}

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "node_modules") continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

const templateFiles = walk(templatesRoot);

describe("environment variable reference", () => {
  const doc = readDoc();
  const tables = documentedTables(doc);

  it("finds the tagged tables at all", () => {
    // Guards the parser: a page with no markers would pass every test below.
    expect(tables.size).toBeGreaterThanOrEqual(5);
    for (const [file, names] of tables) {
      expect(fs.existsSync(path.join(repoRoot, file))).toBe(true);
      expect(names.length).toBeGreaterThan(0);
    }
  });

  it("documents exactly the variables each template file declares", () => {
    const mismatches: string[] = [];
    for (const [file, documented] of tables) {
      const declared = declaredVars(file);
      const undocumented = declared.filter((v) => !documented.includes(v));
      const notDeclared = documented.filter((v) => !declared.includes(v));
      if (undocumented.length) mismatches.push(`${file}: declared but not documented: ${undocumented.join(", ")}`);
      if (notDeclared.length) mismatches.push(`${file}: documented but not declared: ${notDeclared.join(", ")}`);
    }
    expect(mismatches).toEqual([]);
  });

  it("has a table for every env file the templates ship", () => {
    const envFiles = templateFiles
      .filter((f) => /^\.env\.(example|template)(\.hbs)?$/.test(path.basename(f)))
      .map((f) => path.relative(repoRoot, f));
    expect(envFiles.length).toBeGreaterThan(0);
    const missing = envFiles.filter((f) => !tables.has(f));
    expect(missing).toEqual([]);
  });

  it("documents every variable the template code reads", () => {
    const documented = new Set([...tables.values()].flat());
    const readers = new Map<string, string>();
    for (const file of templateFiles) {
      if (!/\.(tsx?|jsx?|mjs|cjs|hbs)$/.test(file)) continue;
      const text = fs.readFileSync(file, "utf8");
      for (const m of text.matchAll(/process\.env\.([A-Z][A-Z0-9_]*)/g)) {
        if (!readers.has(m[1])) readers.set(m[1], path.relative(repoRoot, file));
      }
    }
    // Guards the scan: a broken regex would find nothing and pass.
    expect(readers.has("PRIVATE_KEY")).toBe(true);
    const undocumented = [...readers]
      .filter(([name]) => !TOOLING_VARS.has(name) && !documented.has(name))
      .map(([name, file]) => `${name} (read in ${file})`);
    expect(undocumented).toEqual([]);
  });
});

describe("networks table", () => {
  const doc = readDoc();
  const networks = doc.slice(doc.indexOf("## Networks"));

  it("exists", () => {
    expect(doc.includes("## Networks")).toBe(true);
  });

  it("lists the chain IDs and RPC URLs the Hardhat config uses", () => {
    const config = fs.readFileSync(
      path.join(templatesRoot, "contracts", "hardhat", "hardhat.config.ts.hbs"),
      "utf8"
    );
    // Each chain ID appears twice, once in `networks` and once in the Etherscan
    // `customChains`; 31337 is the local node.
    const chainIds = [...new Set([...config.matchAll(/chainId:\s*(\d+)/g)].map((m) => m[1]))]
      .filter((id) => id !== "31337");
    // Matches a literal URL and a `process.env.X || "https://..."` fallback alike.
    const urls = [...config.matchAll(/url:[^\n]*"(https:[^"]+)"/g)].map((m) => m[1]);
    expect(chainIds.sort()).toEqual(["11142220", "42220"]);
    expect(urls.length).toBe(2);
    for (const id of chainIds) expect(networks).toContain(`\`${id}\``);
    for (const url of urls) expect(networks).toContain(`\`${url}\``);
  });

  it("lists the RPC URLs and aliases foundry.toml names", () => {
    const toml = fs.readFileSync(
      path.join(templatesRoot, "contracts", "foundry", "foundry.toml.hbs"),
      "utf8"
    );
    const endpoints = [...toml.matchAll(/^([a-z-]+)\s*=\s*"(https:[^"]+)"/gm)];
    expect(endpoints.length).toBe(2);
    for (const [, alias, url] of endpoints) {
      expect(networks).toContain(`\`${alias}\``);
      expect(networks).toContain(`\`${url}\``);
    }
  });
});
