import { Box, Button, Divider, Group, Modal, Stack } from '@mantine/core';
import { useBoolean } from 'ahooks';
import { useState } from 'react';
import { Recycle } from 'tabler-icons-react';
import { DynamicValueFunctionEditor } from './dynamic-function-editor';
import { DEFAULT_VALUE, TNumberOrDynamic, TNumberOrDynamic_Dynamic } from '../types';

interface IField {
  value: TNumberOrDynamic_Dynamic;
  onChange: (v: TNumberOrDynamic_Dynamic) => void;
}

const Field = ({ value: conf, onChange }: IField) => {
  const [modalOpened, { setTrue, setFalse }] = useBoolean();
  const [local, setLocal] = useState<TNumberOrDynamic_Dynamic>(conf);

  const handleOk = () => {
    setFalse();
    const { type, value } = local;
    const newValue = {
      type,
      value,
    };

    setLocal(newValue);
    onChange(newValue);
  };

  const handleCancel = () => {
    setFalse();
    setLocal(conf);
  };

  const changeFuncContent = (value: TNumberOrDynamic_Dynamic['value']) => {
    setLocal((prev) => ({
      ...prev,
      value,
    }));
  };

  const resetFuncContent = () => {
    changeFuncContent(DEFAULT_VALUE.dynamic.value);
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
        title="Setup dynamic value"
        opened={modalOpened}
        onClose={setFalse}
        closeOnClickOutside={false}
        withCloseButton={false}
        zIndex={320}
      >
        {modalOpened && (
          <Stack>
            <Divider mt={10} mb={-10} label="Dynamic by a custom function" labelPosition="center" variant="dashed" />
            <DynamicValueFunctionEditor value={local.value} onChange={changeFuncContent} />
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

interface IProps {
  value: TNumberOrDynamic;
  onChange: (v: TNumberOrDynamic) => void;
}

export const DynamicValueField = ({ value, onChange }: IProps) => {
  if (value.type !== 'dynamic') {
    return null;
  }

  return <Field value={value} onChange={onChange} />;
};
