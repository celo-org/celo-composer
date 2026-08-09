/**
 * Adding a template is not one edit. A template type has to be threaded through the
 * picker, the two prompts it wants skipped, the non-interactive `--yes` path, the
 * final fallbacks, and the plopfile actions. Miss one and the CLI still runs — it
 * just quietly asks for a wallet provider the template has no use for, or writes no
 * files at all.
 *
 * These tests generate real projects into a temp directory and assert on the output,
 * so they fail on a missed edit rather than on a changed line number.
 */

import { execFileSync } from "child_process";
import fs from "fs-extra";
import os from "os";
import path from "path";

const repoRoot = path.resolve(__dirname, "..", "..");

/**
 * Drive the CLI the way a user does, as a subprocess, rather than importing the
 * generator. The source is ESM and several of its dependencies (chalk, ora) are
 * ESM-only, which Jest cannot load in-process without switching the whole runner
 * over. Running it through `tsx` sidesteps that and tests the real entry point.
 */
function generate(templateType: string, name: string): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "composer-test-"));
  execFileSync(
    path.join(repoRoot, "node_modules", ".bin", "tsx"),
    [
      path.join(repoRoot, "src", "index.ts"),
      "create",
      name,
      "-t",
      templateType,
      "--skip-install",
    ],
    { cwd: root, stdio: "pipe" }
  );
  return path.join(root, name);
}

// Generating a project shells out to git; give it room.
jest.setTimeout(120_000);

describe("x402 template wiring", () => {
  let projectPath: string;

  beforeAll(() => {
    projectPath = generate("x402", "x402-fixture");
  });

  afterAll(() => {
    fs.removeSync(path.dirname(projectPath));
  });

  it("writes the seller, the buyer and their config into apps/api", () => {
    for (const file of [
      "apps/api/src/index.ts",
      "apps/api/src/buyer.ts",
      "apps/api/src/x402.ts",
      "apps/api/package.json",
      "apps/api/tsconfig.json",
      "apps/api/.env.template",
    ]) {
      expect(fs.pathExistsSync(path.join(projectPath, file))).toBe(true);
    }
  });

  it("writes the setup guide at the project root", () => {
    expect(fs.pathExistsSync(path.join(projectPath, "X402_SETUP.md"))).toBe(true);
  });

  it("pins the seller to a real Celo facilitator and a 6-decimal USDC price", () => {
    const x402 = fs.readFileSync(
      path.join(projectPath, "apps/api/src/x402.ts"),
      "utf8"
    );
    // Both hosted facilitators, and the CAIP-2 ids they actually advertise.
    expect(x402).toContain("https://api.x402.sepolia.celo.org");
    expect(x402).toContain("https://api.x402.celo.org");
    expect(x402).toContain("eip155:11142220");
    expect(x402).toContain("eip155:42220");
    // Testnet is the default, so running the scaffold costs nothing.
    expect(x402).toContain('process.env.X402_NETWORK === "mainnet"');
  });

  it("declares the x402 scripts and the paywall peer exemption on the root package", () => {
    const pkg = fs.readJsonSync(path.join(projectPath, "package.json"));
    expect(pkg.scripts["api:dev"]).toBeDefined();
    expect(pkg.scripts["api:buy"]).toBeDefined();
    // @x402/paywall drags in Solana and Algorand wallet stacks plus React 19 for a
    // browser page an API seller never renders. Leaving it unmet is deliberate.
    expect(pkg.pnpm?.peerDependencyRules?.ignoreMissing).toContain(
      "@x402/paywall"
    );
  });

  it("skips the wallet and contract scaffolding it never asked for", () => {
    expect(fs.pathExistsSync(path.join(projectPath, "apps/contracts"))).toBe(false);
    const components = fs.readdirSync(
      path.join(projectPath, "apps/web/src/components")
    );
    expect(components).not.toContain("connect-button.tsx");
  });
});

describe("other templates are unaffected", () => {
  let projectPath: string;

  beforeAll(() => {
    projectPath = generate("basic", "basic-fixture");
  });

  afterAll(() => {
    fs.removeSync(path.dirname(projectPath));
  });

  it("does not leak apps/api or the x402 guide into a basic project", () => {
    expect(fs.pathExistsSync(path.join(projectPath, "apps/api"))).toBe(false);
    expect(fs.pathExistsSync(path.join(projectPath, "X402_SETUP.md"))).toBe(false);
  });

  it("does not leak the pnpm peer exemption into a basic project", () => {
    const pkg = fs.readJsonSync(path.join(projectPath, "package.json"));
    expect(pkg.pnpm).toBeUndefined();
  });
});
