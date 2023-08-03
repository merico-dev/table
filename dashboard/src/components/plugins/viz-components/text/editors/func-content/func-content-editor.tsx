import { Box } from '@mantine/core';
import Editor from '@monaco-editor/react';

interface IFuncContentEditor {
  value: string;
  onChange: (v: string) => void;
}
export const FuncContentEditor = ({ value, onChange }: IFuncContentEditor) => {
  const changeContent = (v: string | undefined) => {
    if (!v) {
      return;
    }
    onChange(v);
  };

  return (
    <Box sx={{ position: 'relative' }}>
      <Editor
        height="500px"
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
