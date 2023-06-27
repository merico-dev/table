import * as path from 'path';

export const projectFilePatterns = ['package.json'];

function registerProjectTargets(projectFilePath) {
  const projectDir = (...items: string[]) =>
    path.join(path.dirname(projectFilePath), ...items);
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
      dependsOn: ['build', '^build'],
    },
    build: {
      executor: 'nx:run-commands',
      inputs: [
        '{projectRoot}/**/*',
        '!{projectRoot}/dist/**/*',
        '!{projectRoot}/node_modules/**/*}',
      ],
      outputs: ['{projectRoot}/dist'],
      options: {
        cwd: projectDir(),
        commands: ['vite build'],
      },
      dependsOn: ['^build'],
    },
  };
}

exports.registerProjectTargets = registerProjectTargets;
