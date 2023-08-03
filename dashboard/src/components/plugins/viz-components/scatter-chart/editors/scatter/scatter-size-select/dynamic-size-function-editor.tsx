import { TScatterSize_Dynamic } from './types';
import Editor from '@monaco-editor/react';
import { Box } from '@mantine/core';

interface IDynamicSizeFunctionEditor {
  value: TScatterSize_Dynamic['func_content'];
  onChange: (v: TScatterSize_Dynamic['func_content']) => void;
}
export const DynamicSizeFunctionEditor = ({ value, onChange }: IDynamicSizeFunctionEditor) => {
  const handleChange = (v: string | undefined) => {
    if (!v) {
      return;
    }
    onChange(v);
  };

  return (
    <Box>
      <Editor
        height="500px"
        defaultLanguage="javascript"
        value={value}
        onChange={handleChange}
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
