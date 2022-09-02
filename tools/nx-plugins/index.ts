import * as path from 'path';

export const projectFilePatterns = ['package.json'];

function registerProjectTargets(projectFilePath) {
  const projectDir = (...items: string[]) => path.join(path.dirname(projectFilePath), ...items);
  return {
    lint: {
      executor: '@nrwl/linter:eslint',
      options: {
        lintFilePatterns: [
          projectDir('src/**/*.ts'),
          projectDir('src/**/*.tsx'),
          projectDir('cypress/**/*.tsx'),
          projectDir('cypress/**/*.ts'),
        ],
      },
    },
  };
}

exports.registerProjectTargets = registerProjectTargets;
