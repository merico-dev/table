import { TNumberOrDynamic_Dynamic } from '../types';
import Editor from '@monaco-editor/react';
import { Box } from '@mantine/core';

interface IDynamicSizeFunctionEditor {
  value: TNumberOrDynamic_Dynamic['value'];
  onChange: (v: TNumberOrDynamic_Dynamic['value']) => void;
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
