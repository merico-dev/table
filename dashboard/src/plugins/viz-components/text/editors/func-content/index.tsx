import { Button, Group, Modal, Stack } from '@mantine/core';
import { useBoolean } from 'ahooks';
import { forwardRef, useEffect, useState } from 'react';
import { Recycle } from 'tabler-icons-react';
import { AnyObject } from '~/types';
import { DEFAULT_TEXT_FUNC_CONTENT } from '../../type';
import { FuncContentEditor } from './func-content-editor';

interface IFuncContentField {
  value: string;
  onChange: (v: string) => void;
}

export const FuncContentField = forwardRef(({ value, onChange }: IFuncContentField, _ref: any) => {
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
    setLocalValue(DEFAULT_TEXT_FUNC_CONTENT);
  };

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  return (
    <>
      <Button variant="filled" mt={24} onClick={setTrue} sx={{ flexGrow: 0 }}>
        Edit Content
      </Button>
      <Modal
        size={800}
        title="Text content"
        opened={modalOpened}
        onClose={setFalse}
        closeOnClickOutside={false}
        withCloseButton={false}
        zIndex={320}
      >
        {modalOpened && (
          <Stack>
            <FuncContentEditor value={localValue} onChange={setLocalValue} />
            <Group position="apart">
              <Button onClick={resetFuncContent} color="red" leftIcon={<Recycle size={20} />}>
                Rest
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
