import { Box } from '@mantine/core';
import Editor, { loader } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';
loader.config({ monaco });

interface IFunctionStringEditor {
  value: string;
  onChange: (v: string) => void;
}
export const FunctionStringEditor = ({ value, onChange }: IFunctionStringEditor) => {
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
