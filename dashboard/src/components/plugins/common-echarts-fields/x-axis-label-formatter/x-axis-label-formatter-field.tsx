import { Button, Checkbox, Group, Modal, Stack } from '@mantine/core';
import { IconDeviceFloppy, IconMathFunction, IconRecycle } from '@tabler/icons-react';
import { useBoolean } from 'ahooks';
import { forwardRef, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { XAxisLabelFormatterFunctionEditor } from './function-editor';
import { IXAxisLabelFormatter, getDefaultXAxisLabelFormatter } from './types';

interface IXAxisLabelFormatterField {
  value: IXAxisLabelFormatter;
  onChange: (v: IXAxisLabelFormatter) => void;
  triggerButtonText?: string;
}

export const XAxisLabelFormatterField = forwardRef(
  ({ value, onChange, triggerButtonText }: IXAxisLabelFormatterField, _ref: any) => {
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
      changeFuncContent(getDefaultXAxisLabelFormatter().func_content);
    };

    const buttonText = triggerButtonText ?? t('chart.axis.customize_label');
    return (
      <>
        <Button
          variant="filled"
          color="grape"
          leftSection={<IconMathFunction size={16} />}
          mt={24}
          onClick={setTrue}
          sx={{ flexGrow: 0 }}
        >
          {buttonText}
        </Button>
        <Modal
          size={800}
          title={buttonText}
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
  },
);
