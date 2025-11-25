import * as path from 'path';
import * as fs from 'fs';
import type { CreateNodesV2 } from '@nx/devkit';

export const createNodesV2: CreateNodesV2 = [
  '**/package.json',
  async (projectConfigurationFiles, options, context) => {
    return await Promise.all(
      projectConfigurationFiles.map(async (projectConfigurationFile) => {
        const projectRoot = path.dirname(projectConfigurationFile);

        // Skip root package.json
        if (projectRoot === '.') {
          return [projectConfigurationFile, {}];
        }

        return [
          projectConfigurationFile,
          {
            projects: {
              [projectRoot]: {
                targets: {
                  lint: {
                    executor: '@nx/eslint:eslint',
                    options: {
                      lintFilePatterns: [
                        `${projectRoot}/src/**/*.ts`,
                        `${projectRoot}/src/**/*.tsx`,
                        `${projectRoot}/cypress/**/*.tsx`,
                        `${projectRoot}/cypress/**/*.ts`,
                      ],
                    },
                  },
                  check: {
                    executor: 'nx:run-commands',
                    options: {
                      commands: [`yarn tsgo --noEmit -p ${projectRoot}/tsconfig.json`],
                    },
                    inputs: ['default', '^default'],
                    dependsOn: ['build', '^build'],
                  },
                  build: {
                    executor: 'nx:run-commands',
                    inputs: ['default', '^default'],
                    outputs: [`{projectRoot}/dist`],
                    options: {
                      cwd: projectRoot,
                      commands: ['vite build 2>&1 | grep -v "TS7056"'],
                    },
                    dependsOn: ['^build'],
                  },
                  'is-published': {
                    executor: 'workspace-plugin:is-published',
                    options: {
                      packageJson: `${projectRoot}/package.json`,
                    },
                  },
                },
              },
            },
          },
        ];
      }),
    );
  },
];
