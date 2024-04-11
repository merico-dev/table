import { Box, Button, Divider, Group, Modal, Stack } from '@mantine/core';
import { useBoolean } from 'ahooks';
import { useState } from 'react';
import { Recycle } from 'tabler-icons-react';
import { DynamicValueFunctionEditor } from './dynamic-function-editor';
import { DEFAULT_VALUE, TNumberOrDynamic, TNumberOrDynamic_Dynamic } from '../types';
import { useTranslation } from 'react-i18next';
import { IconDeviceFloppy, IconMathFunction } from '@tabler/icons-react';

interface IField {
  value: TNumberOrDynamic_Dynamic;
  onChange: (v: TNumberOrDynamic_Dynamic) => void;
}

const Field = ({ value: conf, onChange }: IField) => {
  const { t } = useTranslation();
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
        <Button
          color="grape"
          variant="filled"
          leftIcon={<IconMathFunction size={16} />}
          mt={24}
          onClick={setTrue}
          sx={{ flexGrow: 0 }}
        >
          {t('chart.number_or_dynamic_value.dynamic.setup')}
        </Button>
      </Box>
      <Modal
        size={800}
        title={t('chart.number_or_dynamic_value.dynamic.setup_title')}
        opened={modalOpened}
        onClose={setFalse}
        closeOnClickOutside={false}
        withCloseButton={false}
        zIndex={320}
      >
        {modalOpened && (
          <Stack>
            <Divider
              mt={10}
              mb={-10}
              label={t('chart.number_or_dynamic_value.dynamic.guide')}
              labelPosition="center"
              variant="dashed"
            />
            <DynamicValueFunctionEditor value={local.value} onChange={changeFuncContent} />
            <Group position="apart">
              <Button onClick={resetFuncContent} color="red" leftIcon={<Recycle size={20} />}>
                {t('common.actions.reset_to_default')}
              </Button>
              <Group position="right">
                <Button onClick={handleCancel} variant="subtle">
                  {t('common.actions.cancel')}
                </Button>
                <Button color="green" leftIcon={<IconDeviceFloppy size={16} />} onClick={handleOk}>
                  {t('common.actions.save')}
                </Button>
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
