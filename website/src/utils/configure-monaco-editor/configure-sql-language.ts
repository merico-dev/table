import type { Monaco } from '@monaco-editor/react';
import _ from 'lodash';

function defineSQLTheme(monaco: Monaco) {
  const legend = {
    tokenTypes: ['global_sql_snippets', 'sql_snippets', 'context', 'filters', '$'],
    tokenModifiers: [],
  };

  const tokenPattern = /([a-zA-Z_\$]+)/g;

  monaco.languages.registerDocumentSemanticTokensProvider('sql', {
    getLegend: function () {
      return legend;
    },
    // @ts-expect-error typeof resultId
    provideDocumentSemanticTokens: function (model) {
      const lines = model.getLinesContent();
      const data = [];

      let prevLine = 0;
      let prevChar = 0;

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        for (let match = null; (match = tokenPattern.exec(line)); ) {
          // translate token and modifiers to number representations
          const type = legend.tokenTypes.indexOf(match[1]);
          if (type === -1) {
            continue;
          }
          const modifier = 0;

          data.push(
            // translate line to deltaLine
            i - prevLine,
            // for the same line, translate start to deltaStart
            prevLine === i ? match.index - prevChar : match.index,
            match[0].length,
            type,
            modifier,
          );

          prevLine = i;
          prevChar = match.index;
        }
      }
      return {
        data: new Uint32Array(data),
        resultId: null,
      };
    },
    releaseDocumentSemanticTokens: _.noop,
  });

  monaco.editor.defineTheme('sql-dark', {
    base: 'vs-dark',
    inherit: true,
    colors: {},
    rules: [
      { token: 'global_sql_snippets', foreground: 'ffd700', fontStyle: 'bold' },
      { token: 'sql_snippets', foreground: 'ffd700', fontStyle: 'bold' },
      { token: 'context', foreground: 'ffd700', fontStyle: 'bold' },
      { token: 'filters', foreground: 'ffd700', fontStyle: 'bold' },
      { token: '$', foreground: 'ffd700' },
    ],
  });
}

function registerCompletion(monaco: Monaco) {
  monaco.languages.registerCompletionItemProvider('sql', {
    provideCompletionItems: function (model, position) {
      const word = model.getWordUntilPosition(position);
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn,
      };
      return {
        suggestions: [
          {
            label: 'global_sql_snippets',
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: 'global_sql_snippets',
            range: range,
          },
          {
            label: 'context',
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: 'context',
            range: range,
          },
          {
            label: 'filters',
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: 'filters',
            range: range,
          },
          {
            label: 'sql_snippets',
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: 'sql_snippets',
            range: range,
          },
        ],
      };
    },
  });
}
export function configureSQLLanguage(monaco: Monaco) {
  registerCompletion(monaco);
  defineSQLTheme(monaco);
}
