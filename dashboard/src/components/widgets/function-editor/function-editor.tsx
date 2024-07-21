import Editor, { Monaco, OnMount } from '@monaco-editor/react';
import { useEffect, useRef } from 'react';
import * as monaco from 'monaco-editor';
interface IFunctionEditor {
  value: TFunctionString;
  onChange: (v: TFunctionString) => void;
  onMount?: OnMount;
}
export const FunctionEditor = ({ value, onChange, onMount }: IFunctionEditor) => {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<Monaco | null>(null);

  const changeContent = (v?: TFunctionString) => {
    if (!v) {
      onChange('');
      return;
    }
    onChange(v);
  };

  useEffect(() => {
    const model = editorRef.current?.getModel();
    if (!model) {
      return;
    }
    if (!model.getValue()) {
      // init from blank
      model.setValue(value);
    }
  }, [value]);

  const handleOnMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
    onMount?.(editor, monaco);
  };

  console.log({ value });
  return (
    <Editor
      className="function-editor"
      height="100%"
      defaultLanguage="javascript"
      // https://github.com/suren-atoyan/monaco-react/issues/402
      defaultValue={value}
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
      onMount={handleOnMount}
    />
  );
};
