import { NodePlopAPI } from 'plop';
import nodePlop from 'node-plop';
import path from 'path';
import fs from 'fs-extra';

export interface PlopConfig {
  projectName: string;
  description: string;
  projectPath: string;
  installDependencies?: boolean;
}

/**
 * Professional template-driven project generator using Plop.js
 */
export class TemplateGenerator {
  /**
   * Generate a new Celo project using templates
   */
  async generateProject(config: PlopConfig): Promise<void> {
    const { projectName, description, projectPath } = config;

    try {
      // Ensure the parent directory exists
      await fs.ensureDir(path.dirname(projectPath));

      // Initialize plop asynchronously
      const plopfilePath = path.join(__dirname, '../../plopfile.ts');
      const plopInstance = await nodePlop(plopfilePath, {
        destBasePath: process.cwd(),
        force: false
      });

      // Get the generator asynchronously
      const generator = plopInstance.getGenerator('celo-project');
      
      // Run the generator with the provided configuration
      const results = await generator.runActions({
        projectName,
        description,
        destinationPath: projectPath,
      });

      // Check if generation was successful
      if (results.failures && results.failures.length > 0) {
        throw new Error(`Template generation failed: ${results.failures.map(f => f.error).join(', ')}`);
      }
    } catch (error) {
      console.error('Error generating project:', error);
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
