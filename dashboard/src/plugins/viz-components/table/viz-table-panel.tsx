import { ActionIcon, Button, Group, Stack, Switch, Text, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { randomId } from '@mantine/hooks';
import { Prism } from '@mantine/prism';
import { defaults } from 'lodash';
import { useEffect } from 'react';
import { DeviceFloppy, Trash } from 'tabler-icons-react';
import { DataFieldSelector } from '../../../panel/settings/common/data-field-selector';
import { VizConfigProps } from '../../../types/plugin';
import { useStorageData } from '../../hooks';
import { DEFAULT_CONFIG, ITableConf, ValueType } from './type';
import { ValueTypeSelector } from './value-type-selector';

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
    <Stack mt="md" spacing="xs">
      <form
        onSubmit={form.onSubmit(async (val) => {
          await setConf(val);
        })}
      >
        <Group position="apart" mb="lg" sx={{ position: 'relative' }}>
          <Text>Table Config</Text>
          <ActionIcon type="submit" aria-label="save config" mr={5} variant="filled" color="blue">
            <DeviceFloppy size={20} />
          </ActionIcon>
        </Group>
        <Stack mt="md" spacing="xs" p="md" mb="sm" sx={{ border: '1px solid #eee', borderRadius: '5px' }}>
          <DataFieldSelector label="ID Field" required data={data} {...form.getInputProps('id_field')} />
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
          <Stack>
            <Text>Other</Text>
            <Group position="apart" grow>
              <Switch label="Striped" {...form.getInputProps('striped', { type: 'checkbox' })} />
              <Switch label="Highlight on hover" {...form.getInputProps('highlightOnHover', { type: 'checkbox' })} />
            </Group>
          </Stack>
        </Stack>
        <Stack mt="xs" spacing="xs" p="md" mb="xl" sx={{ border: '1px solid #eee', borderRadius: '5px' }}>
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
        </Stack>
        <Text weight={500} mb="md">
          Current Configuration:
        </Text>
        <Prism language="json" colorScheme="dark" noCopy>
          {JSON.stringify(form.values, null, 2)}
        </Prism>
      </form>
    </Stack>
  );
}
