export const UsageRegs = {
  sqlSnippet: /(?<=sql_snippets\.)([^\?}.]+)/gm,
  context: /(?<=context\.)([^\?}.]+)/gm,
  filter: /(?<=filters\.)([^\?}.]+)/gm,
};

export type DependencyInfo = {
  type: 'sql_snippet' | 'context' | 'filter';
  key: string;
  valid: boolean;
};
