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
      <Stack spacing={4}>
        <Text size={14}>{label}</Text>
        <FunctionEditor value={localValue} onChange={setLocalValue} />
        <Group mt={10} position="apart">
          <Button onClick={resetFuncContent} color="red" leftIcon={<Recycle size={20} />}>
            Reset to default
          </Button>
          {hasChanges && (
            <Group position="right">
              <Button onClick={handleCancel} variant="subtle">
                Cancel
              </Button>
              <Button onClick={handleOk}>OK</Button>
            </Group>
          )}
        </Group>
      </Stack>
    );
  },
);
