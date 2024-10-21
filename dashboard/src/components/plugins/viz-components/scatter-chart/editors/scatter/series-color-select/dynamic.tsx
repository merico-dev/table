import { Box, Button, Group, Modal, Stack } from '@mantine/core';
import { useBoolean } from 'ahooks';
import { useState } from 'react';

import { IconDeviceFloppy, IconMathFunction, IconRecycle } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { DynamicColorFunctionEditor } from './dynamic-color-function-editor';
import { DEFAULT_SERIES_COLOR, TSeriesColor, TSeriesColor_Dynamic } from './types';

interface IField {
  value: TSeriesColor_Dynamic;
  onChange: (v: TSeriesColor_Dynamic) => void;
}

const Field = ({ value, onChange }: IField) => {
  const { t } = useTranslation();
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
        <Button
          color="grape"
          variant="filled"
          leftSection={<IconMathFunction size={16} />}
          mt={24}
          onClick={setTrue}
          sx={{ flexGrow: 0 }}
        >
          {t('viz.scatter_chart.color.dynamic.setup')}
        </Button>
      </Box>
      <Modal
        size={800}
        title={t('viz.scatter_chart.color.dynamic.setup_title')}
        opened={modalOpened}
        onClose={setFalse}
        closeOnClickOutside={false}
        withCloseButton={false}
        zIndex={320}
      >
        {modalOpened && (
          <Stack>
            <DynamicColorFunctionEditor value={localValue.func_content} onChange={changeFuncContent} />
            <Group justify="space-between">
              <Button onClick={resetFuncContent} color="red" leftSection={<IconRecycle size={20} />}>
                {t('common.actions.reset_to_default')}
              </Button>
              <Group justify="flex-end">
                <Button onClick={handleCancel} variant="subtle">
                  {t('common.actions.cancel')}
                </Button>
                <Button color="green" leftSection={<IconDeviceFloppy size={16} />} onClick={handleOk}>
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
