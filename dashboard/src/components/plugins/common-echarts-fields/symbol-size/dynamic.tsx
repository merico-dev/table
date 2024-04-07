import { Box, Button, Divider, Group, Modal, Stack } from '@mantine/core';
import { IconMathFunction } from '@tabler/icons-react';
import { useBoolean } from 'ahooks';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Recycle } from 'tabler-icons-react';
import { DynamicSizeFunctionEditor } from './dynamic-size-function-editor';
import { DEFAULT_SCATTER_SIZE, SymbolSize, SymbolSize_Dynamic } from './types';

interface IField {
  value: SymbolSize_Dynamic;
  onChange: (v: SymbolSize_Dynamic) => void;
}

const Field = ({ value, onChange }: IField) => {
  const { t } = useTranslation();
  const [modalOpened, { setTrue, setFalse }] = useBoolean();
  const [localValue, setLocalValue] = useState<SymbolSize_Dynamic>(value);

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

  const changeFuncContent = (func_content: SymbolSize_Dynamic['func_content']) => {
    setLocalValue((prev) => ({
      ...prev,
      func_content,
    }));
  };

  const resetFuncContent = () => {
    changeFuncContent(DEFAULT_SCATTER_SIZE.dynamic.func_content);
  };

  return (
    <>
      <Box sx={{ width: '50%' }}>
        <Button
          color="grape"
          variant="filled"
          mt={24}
          onClick={setTrue}
          sx={{ flexGrow: 0 }}
          leftIcon={<IconMathFunction size={16} />}
        >
          {t('chart.symbol_size.setup.label')}
        </Button>
      </Box>
      <Modal
        size={800}
        title={t('chart.symbol_size.setup.title')}
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
              label={t('chart.symbol_size.setup.description')}
              labelPosition="center"
              variant="dashed"
            />
            <DynamicSizeFunctionEditor value={localValue.func_content} onChange={changeFuncContent} />
            <Group position="apart">
              <Button onClick={resetFuncContent} color="red" leftIcon={<Recycle size={20} />}>
                {t('common.actions.reset_to_default')}
              </Button>
              <Group position="right">
                <Button onClick={handleCancel} variant="subtle">
                  {t('common.actions.cancel')}
                </Button>
                <Button color="green" onClick={handleOk}>
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

export interface IDynamicSymbolSizeField {
  value: SymbolSize;
  onChange: (v: SymbolSize) => void;
}

export const DynamicSymbolSizeField = ({ value, onChange }: IDynamicSymbolSizeField) => {
  if (value.type !== 'dynamic') {
    return null;
  }

  return <Field value={value} onChange={onChange} />;
};
