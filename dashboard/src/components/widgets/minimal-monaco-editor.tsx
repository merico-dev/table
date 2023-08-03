import Editor from '@monaco-editor/react';

interface IMinimalMonacoEditor {
  value: string;
  onChange?: (v: string) => void;
  height?: string;
  defaultLanguage?: string;
  theme?: string;
}
export const MinimalMonacoEditor = ({
  value,
  onChange,
  height = '200px',
  defaultLanguage = 'sql',
  theme = 'vs-dark',
}: IMinimalMonacoEditor) => {
  const handleChange = (v: string | undefined) => {
    onChange?.(v ?? '');
  };
  const readonly = !onChange;
  return (
    <Editor
      className="minimal-monaco-editor"
      height={height}
      defaultLanguage={defaultLanguage}
      value={value}
      onChange={readonly ? undefined : handleChange}
      theme={theme}
      options={{
        lineNumbers: 'off',
        folding: false,
        lineDecorationsWidth: 20,
        lineNumbersMinChars: 0,
        wordWrap: 'on',
        minimap: {
          enabled: false,
        },
        readOnly: readonly || !onChange,
        'semanticHighlighting.enabled': true,
      }}
    />
  );
};
