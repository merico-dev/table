import { Group, Stack, Text, ActionIcon } from '@mantine/core';
import { defaults } from 'lodash';
import { useForm } from '@mantine/form';
import { useEffect } from 'react';
import { DeviceFloppy } from 'tabler-icons-react';
import { DataFieldSelector } from '~/panel/settings/common/data-field-selector';
import { VizConfigProps } from '~/types/plugin';
import { useStorageData } from '~/plugins/hooks';
import { DEFAULT_CONFIG, ISunburstConf } from './type';

export function VizSunburstPanel({ context }: VizConfigProps) {
  const { value: conf, set: setConf } = useStorageData<ISunburstConf>(context.instanceData, 'config');
  const { label_field, value_field } = defaults({}, conf, DEFAULT_CONFIG);
  const data = context.data as $TSFixMe[];
  const form = useForm({
    initialValues: {
      label_field: label_field,
      value_field: value_field,
    },
  });

  useEffect(() => {
    form.setValues({ label_field, value_field });
  }, [label_field, value_field]);

  return (
    <Stack mt="md" spacing="xs">
      <form onSubmit={form.onSubmit(setConf)}>
        <Group position="apart" mb="lg" sx={{ position: 'relative' }}>
          <Text>Sunburst Config</Text>
          <ActionIcon type="submit" mr={5} variant="filled" color="blue">
            <DeviceFloppy size={20} />
          </ActionIcon>
        </Group>
        <Stack mt="md" spacing="xs" p="md" mb="sm" sx={{ border: '1px solid #eee', borderRadius: '5px' }}>
          <DataFieldSelector label="Label Field" required data={data} {...form.getInputProps('label_field')} />
          <DataFieldSelector label="Value Field" required data={data} {...form.getInputProps('value_field')} />
        </Stack>
      </form>
    </Stack>
  );
}
