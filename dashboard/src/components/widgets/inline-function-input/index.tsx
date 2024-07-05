import { Box, Button, Group, Overlay, Stack, Text } from '@mantine/core';
import { IconDeviceFloppy, IconPlayerSkipBack, IconRecycle } from '@tabler/icons-react';
import { forwardRef, useCallback, useEffect, useState } from 'react';
import { AboutFunctionUtils } from '../about-function-utils';
import { FunctionEditor, MonacoEditorRestriction } from '../function-editor';
import { useTranslation } from 'react-i18next';
import { OnMount } from '@monaco-editor/react';
// @ts-expect-error types of constrained-editor-plugin
import { constrainedEditor } from 'constrained-editor-plugin';

interface IInlineFunctionInput {
  value: TFunctionString;
  onChange: (v: TFunctionString) => void;
  defaultValue: TFunctionString;
  label: string;
  restrictions?: MonacoEditorRestriction[];
}

export const InlineFunctionInput = forwardRef(
  ({ value, onChange, label, defaultValue, restrictions = [] }: IInlineFunctionInput, _ref: any) => {
    const { t } = useTranslation();
    const [localValue, setLocalValue] = useState<string>(value);

    const handleOk = () => {
      onChange(localValue);
    };

    const handleCancel = () => {
      setLocalValue(value);
    };

    const resetFuncContent = () => {
      setLocalValue(defaultValue);
    };

    useEffect(() => {
      setLocalValue(value);
    }, [value]);

    const applyRestrictions: OnMount = useCallback((editor, monaco) => {
      if (restrictions.length === 0) {
        return;
      }

      const constrainedInstance = constrainedEditor(monaco);
      const model = editor.getModel();
      constrainedInstance.initializeIn(editor);
      constrainedInstance.addRestrictionsTo(model, restrictions);
    }, []);

    const hasChanges = localValue !== value;

    const empty = typeof localValue === 'string' && localValue.length === 0;

    return (
      <Stack spacing={4} sx={{ height: '100%' }}>
        <Group mb={6} position="apart" sx={{ flexShrink: 0, flexGrow: 0 }}>
          <Group position="left">
            <AboutFunctionUtils />
          </Group>
          <Group position="right">
            <Button onClick={resetFuncContent} size="xs" variant="default" leftIcon={<IconPlayerSkipBack size={16} />}>
              {t('common.actions.reset_to_default')}
            </Button>
            <Button
              onClick={handleCancel}
              color="red"
              size="xs"
              disabled={!hasChanges}
              leftIcon={<IconRecycle size={16} />}
            >
              {t('common.actions.revert_changes')}
            </Button>
            <Button
              color="green"
              size="xs"
              onClick={handleOk}
              disabled={!hasChanges}
              leftIcon={<IconDeviceFloppy size={16} />}
            >
              {t('common.actions.save_changes')}
            </Button>
          </Group>
        </Group>
        <Text size={14}>{label}</Text>
        <Box sx={{ position: 'relative', flexGrow: 1 }}>
          {empty && (
            <Overlay center color="#fff" opacity={0.5}>
              <Button color="blue" radius="xl" onClick={resetFuncContent}>
                {t('common.actions.init_with_default')}
              </Button>
            </Overlay>
          )}
          <FunctionEditor value={localValue} onChange={setLocalValue} onMount={applyRestrictions} />
        </Box>
      </Stack>
    );
  },
);
