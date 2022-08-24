import {
  Tree,
  formatFiles,
  installPackagesTask,
  readProjectConfiguration,
  generateFiles,
  joinPathFragments,
} from '@nrwl/devkit';
import { camelCase, pascalCase, paramCase } from 'change-case';

interface GeneratorOptions {
  name: string;
  path?: string;
}

export default async function (tree: Tree, schema: GeneratorOptions) {
  const { name, path: generatePath = 'src/plugins/viz-components' } = schema;
  const project = readProjectConfiguration(tree, 'dashboard');
  const outputPath = joinPathFragments(project.root, generatePath);
  generateFiles(tree, joinPathFragments(__dirname, './files'), outputPath, {
    name: schema.name,
    pascalCase: pascalCase,
    camelCase: camelCase,
    dashCase: paramCase,
  });
  return () => {
    installPackagesTask(tree);
  };
}
