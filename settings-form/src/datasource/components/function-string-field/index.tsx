import { Button, Group, Modal, Stack } from '@mantine/core';
import { useBoolean } from 'ahooks';
import { forwardRef, useEffect, useState } from 'react';
import { Recycle } from 'tabler-icons-react';
import { IStyles } from '../../styles';
import { FunctionStringEditor } from './function-string-editor';
import { useTranslation } from 'react-i18next';
import { IconDeviceFloppy, IconMathFunction } from '@tabler/icons-react';

interface IFunctionStringField {
  value: TFunctionString;
  onChange: (v: TFunctionString) => void;
  defaultValue: TFunctionString;
  label: string;
  modalTitle: string;
  styles: IStyles;
}

export const FunctionStringField = forwardRef(
  ({ value, onChange, label, modalTitle, defaultValue, styles }: IFunctionStringField, _ref: any) => {
    const { t } = useTranslation();
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
        <Button
          color="grape"
          variant="filled"
          leftIcon={<IconMathFunction size={16} />}
          size={styles.button.size}
          onClick={setTrue}
          sx={{ flexGrow: 1 }}
        >
          {label}
        </Button>
        <Modal
          size={800}
          title={modalTitle}
          opened={modalOpened}
          onClose={setFalse}
          closeOnClickOutside={false}
          withCloseButton={false}
        >
          {modalOpened && (
            <Stack>
              <FunctionStringEditor value={localValue} onChange={setLocalValue} />
              <Group position="apart">
                <Button
                  size={styles.button.size}
                  onClick={resetFuncContent}
                  color="red"
                  leftIcon={<Recycle size={20} />}
                >
                  {t('common.actions.reset_to_default')}
                </Button>
                <Group position="right">
                  <Button size={styles.button.size} onClick={handleCancel} variant="subtle">
                    {t('common.actions.cancel')}
                  </Button>
                  <Button
                    size={styles.button.size}
                    color="green"
                    leftIcon={<IconDeviceFloppy size={16} />}
                    onClick={handleOk}
                  >
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
