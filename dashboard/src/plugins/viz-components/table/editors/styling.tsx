import { Group, Stack, Switch, TextInput } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import { ITableConf } from '../type';

interface IStylingFields {
  form: UseFormReturnType<ITableConf>;
}
export function StylingFields({ form }: IStylingFields) {
  return (
    <Stack spacing="xs">
      <Group position="apart" mb="lg" grow sx={{ '> *': { flexGrow: 1 } }}>
        <TextInput
          label="Horizontal Spacing"
          placeholder="10px, 1em, 1rem, 100%..."
          required
          sx={{ flex: 1 }}
          {...form.getInputProps('horizontalSpacing')}
        />
        <TextInput
          label="Vertical Spacing"
          placeholder="10px, 1em, 1rem, 100%..."
          required
          sx={{ flex: 1 }}
          {...form.getInputProps('verticalSpacing')}
        />
      </Group>
      <Group position="apart" mb="lg" grow sx={{ '> *': { flexGrow: 1 } }}>
        <TextInput
          label="Font Size"
          placeholder="10px, 1em, 1rem, 100%..."
          required
          sx={{ flex: 1 }}
          {...form.getInputProps('fontSize')}
        />
      </Group>
      <Group position="apart" grow>
        <Switch label="Striped" {...form.getInputProps('striped', { type: 'checkbox' })} />
        <Switch label="Highlight on hover" {...form.getInputProps('highlightOnHover', { type: 'checkbox' })} />
      </Group>
    </Stack>
  );
}
