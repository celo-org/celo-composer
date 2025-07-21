import { NodePlopAPI } from 'plop';
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
  private plop: NodePlopAPI;

  constructor() {
    this.plop = this.initializePlop();
  }

  /**
   * Generate a new Celo project using templates
   */
  async generateProject(config: PlopConfig): Promise<void> {
    const { projectName, description, projectPath } = config;

    // Ensure the parent directory exists
    await fs.ensureDir(path.dirname(projectPath));

    // Get the generator and run it
    const generator = this.plop.getGenerator('celo-project');
    
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

    return;
  }

  /**
   * Initialize Plop.js with our configuration
   */
  private initializePlop(): NodePlopAPI {
    // Import plop dynamically to avoid module loading issues
    const plop = require('plop');
    
    // Load the plopfile configuration
    const plopfilePath = path.join(__dirname, '../../plopfile.ts');
    const nodePlop = plop(plopfilePath, {
      destBasePath: process.cwd(),
    });

    return nodePlop;
  }
}

export async function runPlopGenerator(config: PlopConfig): Promise<void> {
  const generator = new TemplateGenerator();
  await generator.generateProject(config);
}
