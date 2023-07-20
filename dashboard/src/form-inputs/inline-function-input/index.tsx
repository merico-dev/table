import { Button, Group, Stack, Text } from '@mantine/core';
import { IconDeviceFloppy, IconPlayerSkipBack, IconRecycle } from '@tabler/icons-react';
import { forwardRef, useEffect, useState } from 'react';
import { AboutFunctionUtils } from '../about-function-utils';
import { FunctionEditor } from '../function-editor';

interface IInlineFunctionInput {
  value: TFunctionString;
  onChange: (v: TFunctionString) => void;
  defaultValue: TFunctionString;
  label: string;
}

export const InlineFunctionInput = forwardRef(
  ({ value, onChange, label, defaultValue }: IInlineFunctionInput, _ref: any) => {
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

    const hasChanges = localValue !== value;

    return (
      <Stack spacing={4} sx={{ height: '100%' }}>
        <Group mb={6} position="apart" sx={{ flexShrink: 0, flexGrow: 0 }}>
          <Group position="left">
            <AboutFunctionUtils />
          </Group>
          <Group position="right">
            <Button onClick={resetFuncContent} size="xs" variant="default" leftIcon={<IconPlayerSkipBack size={16} />}>
              Reset to default
            </Button>
            <Button
              onClick={handleCancel}
              color="red"
              size="xs"
              disabled={!hasChanges}
              leftIcon={<IconRecycle size={16} />}
            >
              Revert Changes
            </Button>
            <Button size="xs" onClick={handleOk} disabled={!hasChanges} leftIcon={<IconDeviceFloppy size={16} />}>
              Confirm Changes
            </Button>
          </Group>
        </Group>
        <Text size={14}>{label}</Text>
        <FunctionEditor value={localValue} onChange={setLocalValue} />
      </Stack>
    );
  },
);
