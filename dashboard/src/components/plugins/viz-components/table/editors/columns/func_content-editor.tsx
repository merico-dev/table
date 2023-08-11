import { Box, Button, Group, Modal, Stack } from '@mantine/core';
import Editor from '@monaco-editor/react';
import { useBoolean } from 'ahooks';
import { forwardRef, useEffect, useState } from 'react';
import { Recycle } from 'tabler-icons-react';
import { DEFAULT_CELL_FUNC_CONTENT } from '../../type';

interface IFuncContentEditor {
  value: string;
  onChange: (v: string) => void;
}

export const FuncContentEditor = forwardRef(({ value, onChange }: IFuncContentEditor, _ref: any) => {
  const [modalOpened, { setTrue, setFalse }] = useBoolean();
  const [localValue, setLocalValue] = useState<string>(value);

  const handleOk = () => {
    setFalse();
    onChange(localValue);
  };

  const handleCancel = () => {
    setFalse();
    setLocalValue(value);
  };

  const resetFuncContent = () => {
    setLocalValue(DEFAULT_CELL_FUNC_CONTENT);
  };

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  return (
    <>
      <Button variant="filled" mt={24} onClick={setTrue} sx={{ flexGrow: 0 }}>
        Custom Cell Content
      </Button>
      <Modal
        size={800}
        title="Custom cell content"
        opened={modalOpened}
        onClose={setFalse}
        closeOnClickOutside={false}
        withCloseButton={false}
        zIndex={320}
      >
        {modalOpened && (
          <Stack>
            <Box sx={{ position: 'relative' }}>
              <Editor
                height="500px"
                defaultLanguage="javascript"
                value={localValue}
                onChange={(v?: string) => setLocalValue(v ?? '')}
                theme="vs-dark"
                options={{
                  minimap: {
                    enabled: false,
                  },
                }}
              />
            </Box>
            <Group position="apart">
              <Button onClick={resetFuncContent} color="red" leftIcon={<Recycle size={20} />}>
                Reset
              </Button>
              <Group position="right">
                <Button onClick={handleCancel} variant="subtle">
                  Cancel
                </Button>
                <Button onClick={handleOk}>OK</Button>
              </Group>
            </Group>
          </Stack>
        )}
      </Modal>
    </>
  );
});
