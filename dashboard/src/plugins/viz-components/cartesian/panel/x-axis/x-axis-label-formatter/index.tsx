import { Button, Checkbox, Group, Modal, Stack } from '@mantine/core';
import { useBoolean } from 'ahooks';
import { forwardRef, useState } from 'react';
import { Recycle } from 'tabler-icons-react';
import { AnyObject } from '~/types';
import { XAxisLabelFormatterFunctionEditor } from './function-editor';
import { DEFAULT_X_AXIS_LABEL_FORMATTER, IXAxisLabelFormatter } from './types';

interface IXAxisLabelFormatterField {
  value: IXAxisLabelFormatter;
  onChange: (v: IXAxisLabelFormatter) => void;
  data: AnyObject[];
}

export const XAxisLabelFormatterField = forwardRef(({ value, onChange }: IXAxisLabelFormatterField, _ref: any) => {
  const [modalOpened, { setTrue, setFalse }] = useBoolean();
  const [localValue, setLocalValue] = useState<IXAxisLabelFormatter>(value);

  const changeEnabled = (enabled: boolean) => {
    setLocalValue({
      ...localValue,
      enabled,
    });
  };

  const handleOk = () => {
    setFalse();
    const { enabled, func_content } = localValue;
    const newValue = {
      enabled,
      func_content,
    };

    setLocalValue(newValue);
    onChange(newValue);
  };

  const handleCancel = () => {
    setFalse();
    setLocalValue(value);
  };

  const changeFuncContent = (func_content: string) => {
    setLocalValue((prev) => ({
      ...prev,
      func_content,
    }));
  };

  const resetFuncContent = () => {
    changeFuncContent(DEFAULT_X_AXIS_LABEL_FORMATTER.func_content);
  };

  return (
    <>
      <Button variant="filled" mt={24} onClick={setTrue} sx={{ flexGrow: 0 }}>
        Customize Label
      </Button>
      <Modal
        size={800}
        title="Customize label content"
        opened={modalOpened}
        onClose={setFalse}
        closeOnClickOutside={false}
        withCloseButton={false}
        zIndex={320}
      >
        {modalOpened && (
          <Stack>
            <Checkbox
              mt={10}
              label="Enabled"
              checked={localValue.enabled}
              onChange={(event) => changeEnabled(event.currentTarget.checked)}
            />
            <XAxisLabelFormatterFunctionEditor
              value={localValue.func_content}
              onChange={changeFuncContent}
              disabled={!localValue.enabled}
            />
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
