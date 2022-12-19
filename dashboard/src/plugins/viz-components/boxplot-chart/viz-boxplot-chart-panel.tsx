import { Accordion, ActionIcon, Divider, Group, Stack, Tabs, Text, TextInput } from '@mantine/core';
import { defaults, isEqual } from 'lodash';
import { useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { DeviceFloppy } from 'tabler-icons-react';
import { DataFieldSelector } from '~/panel/settings/common/data-field-selector';
import { MantineColorSelector } from '~/panel/settings/common/mantine-color';
import { VizConfigProps } from '~/types/plugin';
import { useStorageData } from '~/plugins/hooks';
import { ReferenceLinesField } from './reference-lines';
import { DEFAULT_CONFIG, IBoxplotChartConf } from './type';
import { NumbroFormatSelector } from '~/panel/settings/common/numbro-format-selector';

export function VizBoxplotChartPanel({ context }: VizConfigProps) {
  const { value: conf, set: setConf } = useStorageData<IBoxplotChartConf>(context.instanceData, 'config');
  const data = context.data as $TSFixMe[];
  const { variables } = context;
  const defaultValues = useMemo(() => defaults({}, conf, DEFAULT_CONFIG), [conf]);

  const { control, handleSubmit, watch, getValues, reset } = useForm<IBoxplotChartConf>({ defaultValues });
  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues]);

  watch(['x_axis', 'y_axis', 'reference_lines', 'color']);
  const values = getValues();
  const changed = useMemo(() => {
    return !isEqual(values, conf);
  }, [values, conf]);

  return (
    <Stack mt="md" spacing="xs">
      <form onSubmit={handleSubmit(setConf)}>
        <Group position="left" py="md" pl="md" sx={{ borderBottom: '1px solid #eee', background: '#efefef' }}>
          <Text>Chart Config</Text>
          <ActionIcon type="submit" mr={5} variant="filled" color="blue" disabled={!changed}>
            <DeviceFloppy size={20} />
          </ActionIcon>
        </Group>
        <Accordion defaultValue={'Axis'}>
          <Accordion.Item value="Axis">
            <Accordion.Control>Axis</Accordion.Control>
            <Accordion.Panel>
              <Group grow noWrap>
                <Controller
                  name="x_axis.name"
                  control={control}
                  render={({ field }) => <TextInput label="X Axis Name" sx={{ flex: 1 }} {...field} />}
                />
                <Controller
                  name="x_axis.data_key"
                  control={control}
                  render={({ field }) => (
                    <DataFieldSelector label="X Axis Data Field" required data={data} sx={{ flex: 1 }} {...field} />
                  )}
                />
              </Group>
              <Group grow noWrap>
                <Controller
                  name="y_axis.name"
                  control={control}
                  render={({ field }) => <TextInput label="Y Axis Name" sx={{ flex: 1 }} {...field} />}
                />
                <Controller
                  name="y_axis.data_key"
                  control={control}
                  render={({ field }) => (
                    <DataFieldSelector label="Y Axis Data Field" required data={data} sx={{ flex: 1 }} {...field} />
                  )}
                />
              </Group>
              <Stack>
                <Divider mb={-15} variant="dashed" label="Label Format" labelPosition="center" />
                <Controller
                  name={'y_axis.label_formatter'}
                  control={control}
                  render={({ field }) => <NumbroFormatSelector {...field} />}
                />
              </Stack>
            </Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item value="Style">
            <Accordion.Control>Style</Accordion.Control>
            <Accordion.Panel>
              <Stack spacing={4}>
                <Text size="sm">Color</Text>
                <Controller
                  name="color"
                  control={control}
                  render={({ field }) => <MantineColorSelector {...field} />}
                />
              </Stack>
            </Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item value="Advanced">
            <Accordion.Control>
              <Group position="apart">
                Advanced
                <Text align="right" size={12} color="grey">
                  Use variables in reference lines
                </Text>
              </Group>
            </Accordion.Control>
            <Accordion.Panel>
              <Tabs defaultValue="reference_lines">
                <Tabs.List>
                  <Tabs.Tab value="reference_lines">Reference Lines</Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="reference_lines" pt="xs">
                  <ReferenceLinesField variables={variables} control={control} watch={watch} />
                </Tabs.Panel>
              </Tabs>
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </form>
    </Stack>
  );
}
