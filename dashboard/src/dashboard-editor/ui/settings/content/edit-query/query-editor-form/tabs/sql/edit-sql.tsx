import { Button, Group, Stack } from '@mantine/core';
import { IconDeviceFloppy, IconPlayerSkipBack, IconRecycle } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { MinimalMonacoEditor } from '~/components/widgets/minimal-monaco-editor';

interface IEditSQL {
  value: string;
  onChange: (v: string) => void;
  defaultValue: string;
}

export const EditSQL = ({ value, onChange, defaultValue }: IEditSQL) => {
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
          <Button onClick={resetFuncContent} size="xs" variant="default" leftIcon={<IconPlayerSkipBack size={16} />}>
            Reset to default
          </Button>
        </Group>
        <Group position="right">
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
      <MinimalMonacoEditor
        height="100%"
        value={localValue}
        onChange={setLocalValue}
        theme="sql-dark"
        defaultLanguage="sql"
      />
    </Stack>
  );
};
