import Editor from '@monaco-editor/react';
import './index.css';

interface IReadonlyMonacoEditor {
  value: string;
  onChange?: (v: string) => void;
  height?: string;
  language?: string;
  theme?: string;
}
export const ReadonlyMonacoEditor = ({
  value,
  height = '200px',
  language = 'sql',
  theme = 'vs-dark',
}: IReadonlyMonacoEditor) => {
  return (
    <Editor
      className="website-readonly-monaco-editor"
      height={height}
      defaultLanguage={language}
      value={value}
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
        readOnly: true,
      }}
    />
  );
};
