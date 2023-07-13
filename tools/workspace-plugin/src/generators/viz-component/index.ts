import { Tree, formatFiles, readProjectConfiguration, generateFiles, joinPathFragments } from '@nx/devkit';
import { camelCase, pascalCase, paramCase } from 'change-case';

interface GeneratorOptions {
  name: string;
  path?: string;
}

export default async function (tree: Tree, schema: GeneratorOptions) {
  const { name, path: generatePath = 'src/plugins/viz-components' } = schema;
  const project = readProjectConfiguration(tree, 'dashboard');
  const dashedName = paramCase(name);
  const outputPath = joinPathFragments(project.root, generatePath, dashedName);
  generateFiles(tree, joinPathFragments(__dirname, './files'), outputPath, {
    name,
    dashedName,
    pascalcase: pascalCase,
    camelcase: camelCase,
    dashcase: paramCase,
    tmpl: '',
  });
  await formatFiles(tree);
  return () => {};
}
