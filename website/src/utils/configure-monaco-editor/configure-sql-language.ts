import type { Monaco } from '@monaco-editor/react';

export function configureSQLLanguage(monaco: Monaco) {
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
