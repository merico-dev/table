import { readFileSync, promises } from 'fs';
import { resolve } from 'path';
import { execSync } from 'child_process';

export const writeVersionFile = () => {
  return {
    name: 'write-version-file',
    writeBundle: async () => {
      const outputPath = './dist/version.json';
      const versionInfo = {
        semver: JSON.parse(readFileSync(resolve('./package.json'), 'utf-8'))!.version,
        version: execSync('git rev-parse HEAD').toString().trim(),
      };
      const fileContent = JSON.stringify(versionInfo, null, 2);
      try {
        const file = await promises.open(resolve(outputPath), 'w');
        await file.writeFile(fileContent);
        await file.close();
      } catch (e) {
        console.error('Failed to write version file', outputPath);
        throw e;
      }
      console.log('Generated version file');
    },
  };
};
