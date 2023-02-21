import { Button, Group, Stack, Text } from '@mantine/core';
import { forwardRef, useEffect, useState } from 'react';
import { Recycle } from 'tabler-icons-react';
import { FunctionEditor } from '../function-editor.tsx';

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
        <Text size={14}>{label}</Text>
        <FunctionEditor value={localValue} onChange={setLocalValue} />
        <Group mt={10} position="apart" sx={{ flexShrink: 0, flexGrow: 0 }}>
          <Button onClick={resetFuncContent} size="xs" color="red" leftIcon={<Recycle size={16} />}>
            Reset to default
          </Button>
          {hasChanges && (
            <Group position="right">
              <Button onClick={handleCancel} variant="subtle" size="xs">
                Cancel
              </Button>
              <Button size="xs" onClick={handleOk}>
                OK
              </Button>
            </Group>
          )}
        </Group>
      </Stack>
    );
  },
);
