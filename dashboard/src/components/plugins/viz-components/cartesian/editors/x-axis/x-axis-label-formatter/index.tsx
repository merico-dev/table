import { Button, Checkbox, Group, Modal, Stack } from '@mantine/core';
import { useBoolean } from 'ahooks';
import { forwardRef, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Recycle } from 'tabler-icons-react';
import { XAxisLabelFormatterFunctionEditor } from './function-editor';
import { DEFAULT_X_AXIS_LABEL_FORMATTER, IXAxisLabelFormatter } from './types';
import { IconDeviceFloppy, IconMathFunction } from '@tabler/icons-react';

interface IXAxisLabelFormatterField {
  value: IXAxisLabelFormatter;
  onChange: (v: IXAxisLabelFormatter) => void;
}

export const XAxisLabelFormatterField = forwardRef(({ value, onChange }: IXAxisLabelFormatterField, _ref: any) => {
  const { t } = useTranslation();
  const [modalOpened, { setTrue, setFalse }] = useBoolean();
  const [localValue, setLocalValue] = useState<IXAxisLabelFormatter>(value);
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

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
      <Button
        variant="filled"
        color="grape"
        leftIcon={<IconMathFunction size={16} />}
        mt={24}
        onClick={setTrue}
        sx={{ flexGrow: 0 }}
      >
        {t('chart.axis.customize_label')}
      </Button>
      <Modal
        size={800}
        title={t('chart.axis.customize_label')}
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
              label={t('common.enabled')}
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
});
