import { Box, Button, Group, Modal, Stack } from '@mantine/core';
import Editor from '@monaco-editor/react';
import { IconDeviceFloppy, IconMathFunction, IconRecycle } from '@tabler/icons-react';
import { useBoolean } from 'ahooks';
import { forwardRef, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AboutFunctionUtils } from '~/components/widgets/about-function-utils';
import { DEFAULT_CELL_FUNC_CONTENT } from '../../type';

interface IFuncContentEditor {
  value: string;
  onChange: (v: string) => void;
}

export const FuncContentEditor = forwardRef(({ value, onChange }: IFuncContentEditor, _ref: any) => {
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
    setLocalValue(DEFAULT_CELL_FUNC_CONTENT);
  };

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  return (
    <>
      <Button
        color="grape"
        variant="filled"
        leftSection={<IconMathFunction size={16} />}
        mt={24}
        onClick={setTrue}
        sx={{ flexGrow: 0 }}
      >
        {t('viz.table.column.custom_cell_content')}
      </Button>
      <Modal
        size={800}
        title={t('viz.table.column.custom_cell_content')}
        opened={modalOpened}
        onClose={setFalse}
        closeOnClickOutside={false}
        withCloseButton={false}
        zIndex={320}
      >
        {modalOpened && (
          <Stack>
            <Group justify="flex-start">
              <AboutFunctionUtils />
            </Group>
            <Box sx={{ position: 'relative' }}>
              <Editor
                height="500px"
                defaultLanguage="javascript"
                value={localValue}
                onChange={(v?: string) => setLocalValue(v ?? '')}
                theme="vs-dark"
                options={{
                  minimap: {
                    enabled: false,
                  },
                }}
              />
            </Box>
            <Group justify="apart">
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
});
