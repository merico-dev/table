export const UsageRegs = {
  sqlSnippet: /(?<=sql_snippets\.)([^\?}.]+)/gm,
  context: /(?<=context\.)([^\?}.]+)/gm,
  filter: /(?<=filters\.)([^\?}.]+)/gm,
};

export type DependencyInfo = {
  type: 'SQL Snippet' | 'Context' | 'Filter';
  key: string;
  valid: boolean;
};
