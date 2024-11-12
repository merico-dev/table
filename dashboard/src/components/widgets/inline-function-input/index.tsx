import { Box, Button, Group, Overlay, Stack, Text } from '@mantine/core';
import { IconDeviceFloppy, IconPlayerSkipBack, IconRecycle } from '@tabler/icons-react';
import { forwardRef, useCallback, useEffect, useState } from 'react';
import { AboutFunctionUtils } from '../about-function-utils';
import { FunctionEditor, MonacoEditorRestriction } from '../function-editor';
import { useTranslation } from 'react-i18next';
import { OnMount } from '@monaco-editor/react';
// @ts-expect-error type of this lib
import { constrainedEditor } from 'constrained-editor-plugin/dist/esm/constrainedEditor.js';
type Props = {
  value: TFunctionString;
  onChange: (v: TFunctionString) => void;
  defaultValue: TFunctionString;
  label: string;
  restrictions?: MonacoEditorRestriction[];
};

export const InlineFunctionInput = forwardRef<HTMLElement, Props>(
  ({ value, onChange, label, defaultValue, restrictions = [] }, _ref) => {
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

    const applyRestrictions: OnMount = useCallback(
      (editor, monaco) => {
        if (restrictions.length === 0) {
          return;
        }

        const constrainedInstance = constrainedEditor(monaco);
        const model = editor.getModel() as any;
        constrainedInstance.initializeIn(editor);
        constrainedInstance.addRestrictionsTo(model, restrictions);
        if (!model) {
          return;
        }
        if (!model._hasHighlight) {
          constrainedInstance.toggleDevMode();
          model.toggleHighlightOfEditableAreas();
          const currentRanges = model.getCurrentEditableRanges();
          const currentValue = model.getValueInEditableRanges();
          console.debug({ model, currentRanges, currentValue });
        }
      },
      [restrictions],
    );

    const hasChanges = localValue !== value;

    const empty = typeof localValue === 'string' && localValue.length === 0;

    return (
      <Stack
        gap={4}
        sx={{
          height: '100%',
          '.editableArea--multi-line': { backgroundColor: 'rgba(255,183,78, 0.1)' },
          '.editableArea--single-line': { backgroundColor: 'rgba(255,183,78, 0.1)' },
        }}
      >
        <Group mb={6} justify="space-between" sx={{ flexShrink: 0, flexGrow: 0 }}>
          <Group justify="flex-start">
            <AboutFunctionUtils />
          </Group>
          <Group justify="flex-end">
            <Button
              onClick={resetFuncContent}
              size="xs"
              variant="default"
              leftSection={<IconPlayerSkipBack size={16} />}
            >
              {t('common.actions.reset_to_default')}
            </Button>
            <Button
              onClick={handleCancel}
              color="red"
              size="xs"
              disabled={!hasChanges}
              leftSection={<IconRecycle size={16} />}
            >
              {t('common.actions.revert_changes')}
            </Button>
            <Button
              color="green"
              size="xs"
              onClick={handleOk}
              disabled={!hasChanges}
              leftSection={<IconDeviceFloppy size={16} />}
            >
              {t('common.actions.save_changes')}
            </Button>
          </Group>
        </Group>
        <Text size={'14px'}>{label}</Text>
        <Box sx={{ position: 'relative', flexGrow: 1 }}>
          {empty && (
            <Overlay center color="#fff" backgroundOpacity={0.5}>
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
