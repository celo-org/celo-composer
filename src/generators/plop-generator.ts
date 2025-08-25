import fs from "fs-extra";
import nodePlop from "node-plop";
import path from "path";
import { safeCopyTemplate } from "../utils/safe-copy.js";
import { getTemplatesPath, getPlopfilePath } from "../utils/paths.js";

// TypeScript compilation handles TS support - no runtime tsx needed

export interface PlopConfig {
  projectName: string;
  description: string;
  templateType: string;
  walletProvider: string;
  contractFramework: string;
  projectPath: string;
  installDependencies?: boolean;
  // Farcaster miniapp specific fields
  miniappName?: string;
  miniappDescription?: string;
  miniappTags?: string;
  miniappTagline?: string;
}

/**
 * Professional template-driven project generator using Plop.js
 */
export class TemplateGenerator {
  /**
   * Generate a new Celo project using templates
   */
  async generateProject(config: PlopConfig): Promise<void> {
    const {
      projectName,
      description,
      templateType,
      walletProvider,
      contractFramework,
      projectPath,
    } = config;

    try {
      // Ensure the parent directory exists
      await fs.ensureDir(path.dirname(projectPath));

      // Fast path: raw copy for standalone AI chat template (no Plop rendering)
      if (templateType === "ai-chat") {
        // Get templates path using ESM-compatible method
        const templatesPath = getTemplatesPath(import.meta.url);
        const sourcePath = path.join(
          templatesPath,
          "ai",
          "chat-template"
        );

        await safeCopyTemplate(sourcePath, projectPath);

        // Patch package.json name (and version)
        const pkgPath = path.join(projectPath, "package.json");
        if (await fs.pathExists(pkgPath)) {
          const pkg = JSON.parse(await fs.readFile(pkgPath, "utf8")) as Record<string, unknown>;
          (pkg as { name?: string }).name = projectName;
          // Normalize version for new project scaffolds
          (pkg as { version?: string }).version = "0.1.0";
          await fs.writeFile(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
        }

        return; // Skip Plop entirely for this template
      }

      // Initialize plop asynchronously
      const plopfilePath = getPlopfilePath(import.meta.url);
      const plopInstance = await nodePlop(plopfilePath, {
        destBasePath: projectPath,
        force: false,
      });

      // Get the generator asynchronously
      const generator = plopInstance.getGenerator("celo-project");

      // Run the generator with the provided configuration
      const results = await generator.runActions({
        projectName,
        description,
        templateType,
        walletProvider,
        contractFramework,
        projectPath,
      });

      // Check if generation was successful
      if (results.failures && results.failures.length > 0) {
        throw new Error(
          `Template generation failed: ${results.failures
            .map((f) => f.error)
            .join(", ")}`
        );
      }
    } catch (error) {
      console.error("Error generating project:", error);
      throw error;
    }
  }
}

/**
 * Run the Plop generator with the provided configuration
 */
export async function runPlopGenerator(config: PlopConfig): Promise<void> {
  const generator = new TemplateGenerator();
  await generator.generateProject(config);
}
