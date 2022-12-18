import { Box, Overlay } from '@mantine/core';
import Editor from '@monaco-editor/react';

interface IXAxisLabelFormatterFunctionEditor {
  disabled: boolean;
  value: string;
  onChange: (v: string) => void;
}
export const XAxisLabelFormatterFunctionEditor = ({
  disabled,
  value,
  onChange,
}: IXAxisLabelFormatterFunctionEditor) => {
  const changeContent = (v: string | undefined) => {
    if (!v) {
      return;
    }
    onChange(v);
  };

  return (
    <Box sx={{ position: 'relative' }}>
      {disabled && <Overlay opacity={0.6} color="#fff" zIndex={5} blur={2} />}

      <Editor
        height="500px"
        defaultLanguage="javascript"
        value={value}
        onChange={changeContent}
        theme="vs-dark"
        options={{
          minimap: {
            enabled: false,
            readOnly: disabled,
          },
        }}
      />
    </Box>
  );
};
