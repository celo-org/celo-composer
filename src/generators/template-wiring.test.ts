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

import { spawnSync } from "child_process";
import fs from "fs-extra";
import os from "os";
import path from "path";

const repoRoot = path.resolve(__dirname, "..", "..");

interface Generated {
  projectPath: string;
  stderr: string;
}

/**
 * Drive the CLI the way a user does, as a subprocess, rather than importing the
 * generator. The source is ESM and several of its dependencies (chalk, ora) are
 * ESM-only, which Jest cannot load in-process without switching the whole runner
 * over. Running it through `tsx` sidesteps that and tests the real entry point.
 */
function generateWith(
  templateType: string,
  name: string,
  extraArgs: string[] = []
): Generated {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "composer-test-"));
  // spawnSync rather than execFileSync: a diagnostic printed to stderr is part
  // of what these tests assert on, and execFileSync only hands back stdout.
  const run = spawnSync(
    path.join(repoRoot, "node_modules", ".bin", "tsx"),
    [
      path.join(repoRoot, "src", "index.ts"),
      "create",
      name,
      "-t",
      templateType,
      ...extraArgs,
      "--skip-install",
      // -y, because a flag no longer implies it. #411 makes only -y skip the
      // prompts, so without this the fixture blocks on an interactive question
      // with no TTY and dies on "readline was closed". Harmless before that
      // lands, required after.
      "-y",
    ],
    { cwd: root, encoding: "utf8" }
  );
  if (run.status !== 0) {
    throw new Error(
      `create -t ${templateType} ${extraArgs.join(" ")} exited ${run.status}\n${run.stderr}`
    );
  }
  return { projectPath: path.join(root, name), stderr: run.stderr };
}

function generate(templateType: string, name: string): string {
  return generateWith(templateType, name).projectPath;
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
      // apps/api declares a `lint` script, so it has to ship a config or
      // `turbo lint` fails for every generated project.
      "apps/api/.eslintrc.json",
    ]) {
      expect(fs.pathExistsSync(path.join(projectPath, file))).toBe(true);
    }
  });

  it("writes a setup guide that says where to actually get an API key", () => {
    const guide = fs.readFileSync(
      path.join(projectPath, "X402_SETUP.md"),
      "utf8"
    );
    // Settlement 401s without a key, so "ask someone" is not documentation.
    // The dashboard is self-service and new accounts get free credits.
    expect(guide).toContain("https://x402.celo.org");
    expect(guide).toContain("Create API key");
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
    // Without this, .env is never read and the documented setup silently
    // produces a free endpoint. Node's own --env-file needs 20.6; base allows 18.
    expect(x402).toContain('import "dotenv/config"');
  });

  it("declares the x402 scripts and the paywall peer exemption on the root package", () => {
    const pkg = fs.readJsonSync(path.join(projectPath, "package.json"));
    expect(pkg.scripts["api:dev"]).toBeDefined();
    expect(pkg.scripts["api:buy"]).toBeDefined();

    // A defined script is not a runnable one. `turbo run <task>` is rejected at
    // graph construction if the task is absent from the pipeline, so `api:buy`
    // shipped broken while this test stayed green — turbo.json being the
    // thirteenth place a template type has to be threaded through, and the one
    // this suite exists to catch.
    const turbo = fs.readJsonSync(path.join(projectPath, "turbo.json"));
    expect(turbo.pipeline.buy).toBeDefined();
    expect(turbo.pipeline.dev).toBeDefined();
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

/**
 * Four templates cannot honour `--wallet-provider`, for two different reasons,
 * and one of them was not cosmetic. minipay writes `connect-button.tsx` and
 * `wallet-provider.tsx`, the same two filenames the thirdweb template writes,
 * and nothing stopped both actions from running: `-t minipay --wallet-provider
 * thirdweb` aborted with "File already exists", exited 1, and left a project
 * half on disk. The other three discarded the flag in silence.
 */
describe("an explicit --wallet-provider the template cannot honour", () => {
  const roots: string[] = [];
  const keep = (g: Generated): Generated => {
    roots.push(path.dirname(g.projectPath));
    return g;
  };

  afterAll(() => {
    for (const root of roots) fs.removeSync(root);
  });

  it("does not collide with minipay's own components, and says why", () => {
    // The regression. Before this, generateWith threw here on exit 1.
    const { projectPath, stderr } = keep(
      generateWith("minipay", "mp-fixture", ["--wallet-provider", "thirdweb"])
    );

    const components = fs.readdirSync(
      path.join(projectPath, "apps/web/src/components")
    );
    // minipay's own three survive...
    expect(components).toEqual(
      expect.arrayContaining([
        "connect-button.tsx",
        "wallet-provider.tsx",
        "user-balance.tsx",
      ])
    );
    // ...and thirdweb's lib never lands beside them. This is the half of the
    // guard that was missing on the lib action while the components action
    // had it.
    expect(fs.pathExistsSync(path.join(projectPath, "apps/web/src/lib/client.ts"))).toBe(false);

    expect(stderr).toContain("Ignoring --wallet-provider thirdweb");
    expect(stderr).toContain("ships its own wallet components");
  });

  it("gives the other reason for a template that ships no wallet layer", () => {
    const { projectPath, stderr } = keep(
      generateWith("x402", "x402-wallet-fixture", [
        "--wallet-provider",
        "thirdweb",
      ])
    );
    // x402 ships none, so the message must not claim it has its own.
    expect(stderr).toContain("ships no wallet layer of its own");
    expect(stderr).not.toContain("ships its own wallet components");
    expect(fs.pathExistsSync(path.join(projectPath, "apps/web/src/lib/client.ts"))).toBe(false);
  });

  it("stays quiet when the flag agrees with the forcing", () => {
    // `--wallet-provider none` is what the template gets anyway. Warning there
    // would be noise about a conflict that does not exist.
    const { stderr } = keep(
      generateWith("x402", "x402-none-fixture", ["--wallet-provider", "none"])
    );
    expect(stderr).not.toContain("Ignoring --wallet-provider");
  });

  it("still wires thirdweb for a template that can take it", () => {
    // The control. A guard that suppresses everything would pass every
    // assertion above.
    const { projectPath, stderr } = keep(
      generateWith("basic", "basic-thirdweb-fixture", [
        "--wallet-provider",
        "thirdweb",
      ])
    );
    expect(fs.pathExistsSync(path.join(projectPath, "apps/web/src/lib/client.ts"))).toBe(true);
    expect(stderr).not.toContain("Ignoring --wallet-provider");
  });
});
