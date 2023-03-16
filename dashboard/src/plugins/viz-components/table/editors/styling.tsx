import { Group, Stack, Switch, TextInput } from '@mantine/core';
import { Control, Controller, UseFormWatch } from 'react-hook-form';
import { ITableConf } from '../type';

interface IStylingFields {
  control: Control<ITableConf, $TSFixMe>;
  watch: UseFormWatch<ITableConf>;
  data: TVizData;
}
export function StylingFields({ control, watch, data }: IStylingFields) {
  watch(['horizontalSpacing', 'verticalSpacing', 'fontSize', 'striped', 'highlightOnHover']);
  return (
    <Stack spacing="xs">
      <Group position="apart" mb="lg" grow sx={{ '> *': { flexGrow: 1 } }}>
        <Controller
          name="horizontalSpacing"
          control={control}
          render={({ field }) => (
            <TextInput
              label="Horizontal Spacing"
              placeholder="10px, 1em, 1rem, 100%..."
              required
              sx={{ flex: 1 }}
              {...field}
            />
          )}
        />
        <Controller
          name="verticalSpacing"
          control={control}
          render={({ field }) => (
            <TextInput
              label="Vertical Spacing"
              placeholder="10px, 1em, 1rem, 100%..."
              required
              sx={{ flex: 1 }}
              {...field}
            />
          )}
        />
      </Group>
      <Group position="apart" mb="lg" grow sx={{ '> *': { flexGrow: 1 } }}>
        <Controller
          name="fontSize"
          control={control}
          render={({ field }) => (
            <TextInput label="Font Size" placeholder="10px, 1em, 1rem, 100%..." required sx={{ flex: 1 }} {...field} />
          )}
        />
      </Group>
      <Group position="apart" grow>
        <Controller
          name="striped"
          control={control}
          render={({ field }) => (
            <Switch label="Striped" checked={field.value} onChange={(e) => field.onChange(e.currentTarget.checked)} />
          )}
        />
        <Controller
          name="highlightOnHover"
          control={control}
          render={({ field }) => (
            <Switch
              label="Highlight on hover"
              checked={field.value}
              onChange={(e) => field.onChange(e.currentTarget.checked)}
            />
          )}
        />
      </Group>
    </Stack>
  );
}
