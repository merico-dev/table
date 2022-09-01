import { Accordion, ActionIcon, Group, Stack, Text, TextInput } from '@mantine/core';
import { defaults, isEqual } from 'lodash';
import { useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { DeviceFloppy } from 'tabler-icons-react';
import { DataFieldSelector } from '../../../panel/settings/common/data-field-selector';
import { VizConfigProps } from '../../../types/plugin';
import { useStorageData } from '../../hooks';
import { RegressionField } from './regression-item';
import { DEFAULT_CONFIG, IRegressionChartConf } from './type';

export function VizRegressionChartPanel({ context }: VizConfigProps) {
  const { value: conf, set: setConf } = useStorageData<IRegressionChartConf>(context.instanceData, 'config');
  const data = context.data as any[];
  const defaultValues = useMemo(() => defaults({}, conf, DEFAULT_CONFIG), [conf]);

  const { control, handleSubmit, watch, getValues, reset } = useForm<IRegressionChartConf>({ defaultValues });
  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues]);

  watch(['x_axis', 'y_axis', 'regression']);
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
              </Group>
            </Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item value="Regression">
            <Accordion.Control>Regression Line</Accordion.Control>
            <Accordion.Panel>
              <RegressionField control={control} watch={watch} data={data} />
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </form>
    </Stack>
  );
}
