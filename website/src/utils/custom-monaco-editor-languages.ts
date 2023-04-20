import { loader } from '@monaco-editor/react';
import type { Monaco } from '@monaco-editor/react';
import { MonacoPath } from './config';

function registerGitDiffLanguage(monaco: Monaco) {
  monaco.languages.register({ id: 'git-diff-language' });
  monaco.languages.setMonarchTokensProvider('git-diff-language', {
    tokenizer: {
      root: [
        [/^\-\s+.*/, 'line-removed'],
        [/^\+\s+.*/, 'line-added'],
        [/^(diff\s|index|---|\+\+\+).*/, 'line-info'],
        [/^@@.*/, 'file-info'],
      ],
    },
  });
}

function defineGitDiffTheme(monaco: Monaco) {
  monaco.editor.defineTheme('git-diff-theme', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'line-added', foreground: '#009a00' },
      { token: 'line-removed', foreground: '#ff0000' },
      { token: 'line-info', foreground: '#fb70e8' },
      { token: 'file-info', foreground: '#fbfb68' },
    ],
    colors: {},
  });
}

const cleanURL = (str: string) => {
  return str.replace(/([^:])(\/\/+)/g, '$1/');
};
const path = cleanURL(MonacoPath);
loader.config({ paths: { vs: path } });
loader.init().then((monaco) => {
  registerGitDiffLanguage(monaco);
  defineGitDiffTheme(monaco);
});
