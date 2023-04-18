import Editor from '@monaco-editor/react';

interface IReadonlyMonacoEditor {
  value: string;
  onChange?: (v: string) => void;
  height?: string;
  defaultLanguage?: string;
}
export const ReadonlyMonacoEditor = ({ value, height = '200px', defaultLanguage = 'sql' }: IReadonlyMonacoEditor) => {
  return (
    <Editor
      className="minimal-monaco-editor"
      height={height}
      defaultLanguage={defaultLanguage}
      value={value}
      theme="vs-dark"
      options={{
        lineNumbers: 'off',
        folding: false,
        lineDecorationsWidth: 20,
        lineNumbersMinChars: 0,
        wordWrap: 'on',
        minimap: {
          enabled: false,
        },
        readOnly: true,
      }}
    />
  );
};
