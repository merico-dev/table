import { Button, Group, Modal, Stack } from '@mantine/core';
import { IconDeviceFloppy, IconMathFunction } from '@tabler/icons-react';
import { useBoolean } from 'ahooks';
import { forwardRef, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Recycle } from 'tabler-icons-react';
import { DEFAULT_TEXT_FUNC_CONTENT } from '../../type';
import { FuncContentEditor } from './func-content-editor';

interface IFuncContentField {
  value: string;
  onChange: (v: string) => void;
}

export const FuncContentField = forwardRef(({ value, onChange }: IFuncContentField, _ref: any) => {
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
    setLocalValue(DEFAULT_TEXT_FUNC_CONTENT);
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
        mt={24}
        onClick={setTrue}
        sx={{ flexGrow: 0 }}
      >
        {t('viz.text.content.edit')}
      </Button>
      <Modal
        size={800}
        title={t('viz.text.content.label')}
        opened={modalOpened}
        onClose={setFalse}
        closeOnClickOutside={false}
        withCloseButton={false}
        zIndex={320}
      >
        {modalOpened && (
          <Stack>
            <FuncContentEditor value={localValue} onChange={setLocalValue} />
            <Group position="apart">
              <Button onClick={resetFuncContent} color="red" leftIcon={<Recycle size={20} />}>
                {t('common.actions.reset_to_default')}
              </Button>
              <Group position="right">
                <Button onClick={handleCancel} variant="subtle">
                  {t('common.actions.cancel')}
                </Button>
                <Button color="green" leftIcon={<IconDeviceFloppy size={16} />} onClick={handleOk}>
                  {t('common.actions.save_changes')}
                </Button>
              </Group>
            </Group>
          </Stack>
        )}
      </Modal>
    </>
  );
});
