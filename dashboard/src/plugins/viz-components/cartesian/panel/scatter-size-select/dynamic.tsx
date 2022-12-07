import { Box, Button, Divider, Group, Modal, Stack, Textarea } from '@mantine/core';
import { useBoolean } from 'ahooks';
import { useState } from 'react';
import { AnyObject } from '~/types';
import { TScatterSize, TScatterSize_Dynamic } from './types';

interface IField {
  value: TScatterSize_Dynamic;
  onChange: (v: TScatterSize_Dynamic) => void;
  data: AnyObject[];
}

const Field = ({ value, onChange, data }: IField) => {
  const [modalOpened, { setTrue, setFalse }] = useBoolean();
  const [localValue, setLocalValue] = useState<TScatterSize_Dynamic>(value);

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

  const changeFuncContent = (e: $TSFixMe) => {
    if (!e.currentTarget?.value) {
      return;
    }
    setLocalValue((prev) => ({
      ...prev,
      func_content: e.currentTarget.value,
    }));
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
        title="Setup dynamic size"
        opened={modalOpened}
        onClose={setFalse}
        closeOnClickOutside={false}
        withCloseButton={false}
      >
        {modalOpened && (
          <Stack>
            <Divider mt={10} mb={-10} label="Dynamic by a custom function" labelPosition="center" variant="dashed" />
            <Textarea value={localValue.func_content} onBlur={changeFuncContent} />
            <Group position="right">
              <Button onClick={handleCancel} variant="subtle">
                Cancel
              </Button>
              <Button onClick={handleOk}>OK</Button>
            </Group>
          </Stack>
        )}
      </Modal>
    </>
  );
};

interface IDynamicScatterSizeField {
  value: TScatterSize;
  onChange: (v: TScatterSize) => void;
  data: AnyObject[];
}

export const DynamicScatterSizeField = ({ value, onChange, data }: IDynamicScatterSizeField) => {
  if (value.type !== 'dynamic') {
    return null;
  }

  return <Field value={value} onChange={onChange} data={data} />;
};
