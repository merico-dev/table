import { IsDockerPublishedExecutorSchema } from './schema';
import { execSync } from 'child_process';
import { readFileSync } from 'fs';
import { resolve } from 'path';

export default async function runExecutor(options: IsDockerPublishedExecutorSchema) {
  const { packageJson, registry, imageName } = options;

  try {
    // Read package.json file
    const packageJsonPath = resolve(packageJson);
    const packageJsonContent = readFileSync(packageJsonPath, 'utf-8');
    const pkg = JSON.parse(packageJsonContent);

    const version = 'v' + pkg.version;

    if (!version) {
      console.error('package.json must contain a "version" field');
      return {
        success: false,
      };
    }

    const fullImageName = `${registry}/${imageName}:${version}`;
    console.log(`Checking if ${fullImageName} exists in registry...`);

    try {
      // Use docker manifest inspect to check if image exists
      // This requires Docker CLI and prior authentication to the registry
      execSync(`docker manifest inspect ${fullImageName}`, {
        encoding: 'utf-8',
        stdio: ['pipe', 'pipe', 'pipe'],
      });

      // If we reach here, the image exists
      console.error(`${fullImageName} already exists in registry`);
      return {
        success: false,
      };
    } catch (error) {
      // docker manifest inspect returns non-zero if image doesn't exist
      console.log(`${fullImageName} not found in registry - safe to publish`);
      return {
        success: true,
      };
    }
  } catch (error) {
    console.error(`Error reading package.json: ${error.message}`);
    return {
      success: false,
    };
  }
}
