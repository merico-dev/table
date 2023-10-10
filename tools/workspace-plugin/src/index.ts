import * as path from 'path';
import * as fs from 'fs';

export const projectFilePatterns = ['package.json'];

function registerProjectTargets(projectFilePath) {
  const projectDir = (...items: string[]) => path.join(path.dirname(projectFilePath), ...items);
  if (fs.existsSync(projectDir('nx.json'))) {
    return {};
  }
  return {
    lint: {
      executor: '@nx/linter:eslint',
      options: {
        lintFilePatterns: [
          projectDir('src/**/*.ts'),
          projectDir('src/**/*.tsx'),
          projectDir('cypress/**/*.tsx'),
          projectDir('cypress/**/*.ts'),
        ],
      },
    },
    check: {
      executor: 'nx:run-commands',
      options: {
        commands: [`yarn tsc --noEmit -p ${projectDir('tsconfig.json')}`],
      },
      inputs: ['default', '^default'],
      dependsOn: ['build', '^build'],
    },
    build: {
      executor: 'nx:run-commands',
      inputs: ['default', '^default'],
      outputs: ['{projectRoot}/dist'],
      options: {
        cwd: projectDir(),
        // redirect stderr to stdout
        commands: ['vite build 2>&1 | grep -v "TS7056"'],
      },
      dependsOn: ['^build'],
    },
  };
}

exports.registerProjectTargets = registerProjectTargets;
