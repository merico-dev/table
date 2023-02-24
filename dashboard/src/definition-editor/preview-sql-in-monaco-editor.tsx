import Editor from '@monaco-editor/react';

interface IPreviewSQLInMonacoEditor {
  value: string;
  height?: string;
  defaultLanguage?: string;
}
export const PreviewSQLInMonacoEditor = ({
  value,
  height = '200px',
  defaultLanguage = 'sql',
}: IPreviewSQLInMonacoEditor) => {
  return (
    <Editor
      className="preview-sql-in-monaco-editor"
      height={height}
      defaultLanguage={defaultLanguage}
      value={value}
      onChange={undefined}
      theme="vs-light"
      options={{
        lineNumbers: 'on',
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
