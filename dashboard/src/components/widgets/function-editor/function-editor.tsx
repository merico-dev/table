import Editor, { OnMount } from '@monaco-editor/react';

interface IFunctionEditor {
  value: TFunctionString;
  onChange: (v: TFunctionString) => void;
  onMount?: OnMount;
}
export const FunctionEditor = ({ value, onChange, onMount }: IFunctionEditor) => {
  const changeContent = (v?: TFunctionString) => {
    if (!v) {
      onChange('');
      return;
    }
    onChange(v);
  };

  return (
    <Editor
      className="function-editor"
      height="100%"
      defaultLanguage="javascript"
      value={value}
      onChange={changeContent}
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
      }}
      onMount={onMount}
    />
  );
};
