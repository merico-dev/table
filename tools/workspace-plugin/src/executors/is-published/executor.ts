import { IsPublishedExecutorSchema } from './schema';
import { execSync } from 'child_process';
import { readFileSync } from 'fs';
import { resolve } from 'path';

export default async function runExecutor(options: IsPublishedExecutorSchema) {
  const { packageJson } = options;

  try {
    // Read package.json file
    const packageJsonPath = resolve(packageJson);
    const packageJsonContent = readFileSync(packageJsonPath, 'utf-8');
    const pkg = JSON.parse(packageJsonContent);

    const packageName = pkg.name;
    const version = pkg.version;

    if (!packageName || !version) {
      console.error('❌ package.json must contain "name" and "version" fields');
      return {
        success: false,
      };
    }

    console.log(`Checking if ${packageName}@${version} is published on npm...`);

    try {
      // Use npm view to check if the package version exists
      // This will throw an error if the package version doesn't exist
      const command = `npm view ${packageName}@${version} version`;
      const result = execSync(command, {
        encoding: 'utf-8',
        stdio: ['pipe', 'pipe', 'pipe'],
      }).trim();

      if (result === version) {
        console.error(`❌ ${packageName}@${version} is already published on npm`);
        return {
          success: false,
        };
      }
    } catch (error) {
      // npm view returns non-zero exit code if package version doesn't exist
      console.log(`✓ ${packageName}@${version} is not published on npm - safe to publish`);
      return {
        success: true,
      };
    }

    // Fallback - should not reach here
    console.log(`✓ ${packageName}@${version} is not published on npm - safe to publish`);
    return {
      success: true,
    };
  } catch (error) {
    console.error(`❌ Error reading package.json: ${error.message}`);
    return {
      success: false,
    };
  }
}
