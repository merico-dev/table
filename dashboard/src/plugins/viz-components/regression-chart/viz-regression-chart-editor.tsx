import { Accordion, ActionIcon, Group, Stack, Text, TextInput } from '@mantine/core';
import { defaults, isEqual } from 'lodash';
import { useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { DeviceFloppy } from 'tabler-icons-react';
import { useStorageData } from '~/plugins/hooks';
import { VizConfigProps } from '~/types/plugin';
import { XAxisField } from './editors/x-axis';
import { RegressionField } from './regression-item';
import { DEFAULT_CONFIG, IRegressionChartConf } from './type';

export function VizRegressionChartEditor({ context }: VizConfigProps) {
  const { value: conf, set: setConf } = useStorageData<IRegressionChartConf>(context.instanceData, 'config');
  const data = context.data as $TSFixMe[];
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
    <Stack spacing="xs">
      <form onSubmit={handleSubmit(setConf)}>
        <Group position="left" py="md" pl="md" sx={{ borderBottom: '1px solid #eee', background: '#efefef' }}>
          <Text>Chart Config</Text>
          <ActionIcon type="submit" mr={5} variant="filled" color="blue" disabled={!changed}>
            <DeviceFloppy size={20} />
          </ActionIcon>
        </Group>
        <Accordion multiple defaultValue={['Axis', 'Regression']}>
          <Accordion.Item value="Axis">
            <Accordion.Control>Axis</Accordion.Control>
            <Accordion.Panel>
              <XAxisField watch={watch} control={control} data={data} />
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
