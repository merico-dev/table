import { Box } from '@mantine/core';
import Editor from '@monaco-editor/react';

interface IFunctionEditor {
  value: TFunctionString;
  onChange: (v: TFunctionString) => void;
}
export const FunctionEditor = ({ value, onChange }: IFunctionEditor) => {
  const changeContent = (v?: TFunctionString) => {
    if (!v) {
      return;
    }
    onChange(v);
  };

  return (
    <Box sx={{ position: 'relative', flexGrow: 1 }}>
      <Editor
        height="100%"
        defaultLanguage="javascript"
        value={value}
        onChange={changeContent}
        theme="vs-dark"
        options={{
          minimap: {
            enabled: false,
          },
        }}
      />
    </Box>
  );
};
