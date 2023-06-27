import { Box, Button, Divider, Group, Modal, Stack } from '@mantine/core';
import { useBoolean } from 'ahooks';
import { useState } from 'react';
import { Recycle } from 'tabler-icons-react';
import { DynamicColorFunctionEditor } from './dynamic-color-function-editor';
import { DEFAULT_SERIES_COLOR, TSeriesColor, TSeriesColor_Dynamic } from './types';

interface IField {
  value: TSeriesColor_Dynamic;
  onChange: (v: TSeriesColor_Dynamic) => void;
}

const Field = ({ value, onChange }: IField) => {
  const [modalOpened, { setTrue, setFalse }] = useBoolean();
  const [localValue, setLocalValue] = useState<TSeriesColor_Dynamic>(value);

  const handleOk = () => {
    setFalse();
    const { type, func_content } = localValue;
    const newValue = {
      type,
      func_content,
    };

    setLocalValue(newValue);
    onChange(newValue);
  };

  const handleCancel = () => {
    setFalse();
    setLocalValue(value);
  };

  const changeFuncContent = (func_content: TSeriesColor_Dynamic['func_content']) => {
    setLocalValue((prev) => ({
      ...prev,
      func_content,
    }));
  };

  const resetFuncContent = () => {
    changeFuncContent(DEFAULT_SERIES_COLOR.dynamic.func_content);
  };

  return (
    <>
      <Box sx={{ width: '50%' }}>
        <Button variant="filled" mt={24} onClick={setTrue} sx={{ flexGrow: 0 }}>
          Setup
        </Button>
      </Box>
      <Modal
        size={800}
        title="Setup dynamic color"
        opened={modalOpened}
        onClose={setFalse}
        closeOnClickOutside={false}
        withCloseButton={false}
        zIndex={320}
      >
        {modalOpened && (
          <Stack>
            <Divider mt={10} mb={-10} label="Dynamic by a custom function" labelPosition="center" variant="dashed" />
            <DynamicColorFunctionEditor value={localValue.func_content} onChange={changeFuncContent} />
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
};

export interface IDynamicSeriesColorField {
  value: TSeriesColor;
  onChange: (v: TSeriesColor) => void;
}

export const DynamicSeriesColorField = ({ value, onChange }: IDynamicSeriesColorField) => {
  if (value.type !== 'dynamic') {
    return null;
  }

  return <Field value={value} onChange={onChange} />;
};
