import { ActionIcon, Button, Divider, Group, Stack, Switch, Text, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { randomId } from '@mantine/hooks';
import { Prism } from '@mantine/prism';
import { defaults } from 'lodash';
import { useEffect } from 'react';
import { DeviceFloppy, Trash } from 'tabler-icons-react';
import { DataFieldSelector } from '~/panel/settings/common/data-field-selector';
import { BackgroundColorSelect } from '~/plugins/viz-components/table/components/background-color-select';
import { VizConfigProps } from '~/types/plugin';
import { useStorageData } from '~/plugins/hooks';
import { DEFAULT_CONFIG, ITableConf, ValueType } from './type';
import { ValueTypeSelector } from './value-type-selector';
import { StylingFields } from './editors/styling';

export function VizTablePanel({ context }: VizConfigProps) {
  const { value: conf, set: setConf } = useStorageData<ITableConf>(context.instanceData, 'config');
  const form = useForm({
    initialValues: DEFAULT_CONFIG,
  });
  useEffect(() => {
    const updated = defaults({}, conf, form.values, DEFAULT_CONFIG);
    if (conf) {
      form.setValues(updated);
    }
  }, [conf]);
  const data = context.data || [];

  const addColumn = () =>
    form.insertListItem('columns', {
      label: randomId(),
      value_field: 'value',
      value_type: ValueType.string,
    });

  return (
    <form
      onSubmit={form.onSubmit(async (val) => {
        await setConf(val);
      })}
    >
      <Stack mt="md" spacing={10}>
        <Group position="apart" sx={{ position: 'relative' }}>
          <Text>Table Config</Text>
          <ActionIcon type="submit" aria-label="save config" mr={5} variant="filled" color="blue">
            <DeviceFloppy size={20} />
          </ActionIcon>
        </Group>

        <Divider mt={10} mb={-10} variant="dashed" label="Data" labelPosition="center" />
        <DataFieldSelector label="ID Field" required data={data} {...form.getInputProps('id_field')} />

        <Divider mt={10} mb={-10} variant="dashed" label="Style" labelPosition="center" />
        <StylingFields form={form} />

        <Divider mt={10} mb={0} variant="dashed" label="Columns" labelPosition="center" />
        <Switch label="Use Original Data Columns" {...form.getInputProps('use_raw_columns', { type: 'checkbox' })} />
        {!form.values.use_raw_columns && (
          <Stack>
            <Text mt="xl" mb={0}>
              Custom Columns
            </Text>
            {form.values.columns.map((_item, index) => (
              <Stack key={index} my={0} p="md" pr={40} sx={{ border: '1px solid #eee', position: 'relative' }}>
                <Group position="apart" grow>
                  <TextInput
                    label="Label"
                    required
                    id={`col-label-${index}`}
                    sx={{ flex: 1 }}
                    {...form.getInputProps(`columns.${index}.label`)}
                  />
                  <DataFieldSelector
                    label="Value Field"
                    required
                    data={data}
                    {...form.getInputProps(`columns.${index}.value_field`)}
                  />
                  <ValueTypeSelector
                    label="Value Type"
                    sx={{ flex: 1 }}
                    {...form.getInputProps(`columns.${index}.value_type`)}
                  />
                  <BackgroundColorSelect {...form.getInputProps(`columns.${index}.cellBackgroundColor`)} />
                </Group>
                <ActionIcon
                  color="red"
                  variant="subtle"
                  onClick={() => form.removeListItem('columns', index)}
                  sx={{ position: 'absolute', top: 15, right: 5 }}
                >
                  <Trash size={16} />
                </ActionIcon>
              </Stack>
            ))}
            <Group position="center" mt="xs">
              <Button onClick={addColumn}>Add a Column</Button>
            </Group>
          </Stack>
        )}
        <Text weight={500} mb="md">
          Current Configuration:
        </Text>
        <Prism language="json" colorScheme="dark" noCopy>
          {JSON.stringify(form.values, null, 2)}
        </Prism>
      </Stack>
    </form>
  );
}
