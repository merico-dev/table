import { Button, Group, Modal, Stack } from '@mantine/core';
import { useBoolean } from 'ahooks';
import { forwardRef, useEffect, useState } from 'react';
import { Recycle } from 'tabler-icons-react';
import { IStyles } from '../../../styles';
import { FunctionStringEditor } from './function-string-editor';

interface IFunctionStringField {
  value: TFunctionString;
  onChange: (v: TFunctionString) => void;
  defaultValue: TFunctionString;
  label: string;
  styles: IStyles;
}

export const FunctionStringField = forwardRef(
  ({ value, onChange, label, defaultValue, styles }: IFunctionStringField, _ref: any) => {
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
      setLocalValue(defaultValue);
    };

    useEffect(() => {
      setLocalValue(value);
    }, [value]);

    return (
      <>
        <Button variant="filled" size={styles.button.size} onClick={setTrue} sx={{ flexGrow: 1 }}>
          {label}
        </Button>
        <Modal
          size={800}
          title={label}
          opened={modalOpened}
          onClose={setFalse}
          closeOnClickOutside={false}
          withCloseButton={false}
        >
          {modalOpened && (
            <Stack>
              <FunctionStringEditor value={localValue} onChange={setLocalValue} />
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
  },
);
