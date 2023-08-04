import { ActionIcon, Box, Checkbox, Divider, Group, Stack, Tabs, Text } from '@mantine/core';
import { defaultsDeep, isEqual } from 'lodash';
import { useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { DeviceFloppy } from 'tabler-icons-react';
import { DataFieldSelector } from '~/components/panel/settings/common/data-field-selector';

import { useStorageData } from '~/components/plugins/hooks';
import { VizConfigProps } from '~/types/plugin';
import { DimensionsField } from './editors/dimensions';
import { DEFAULT_CONFIG, IRadarChartConf } from './type';

export function VizRadarChartEditor({ context }: VizConfigProps) {
  const { value: confValue, set: setConf } = useStorageData<IRadarChartConf>(context.instanceData, 'config');
  const { variables } = context;
  const conf: IRadarChartConf = useMemo(() => defaultsDeep({}, confValue, DEFAULT_CONFIG), [confValue]);

  const { control, handleSubmit, watch, getValues, reset } = useForm<IRadarChartConf>({ defaultValues: conf });
  useEffect(() => {
    reset(conf);
  }, [conf]);

  watch(['series_name_key', 'background', 'label']);
  const values = getValues();
  const changed = useMemo(() => {
    return !isEqual(values, conf);
  }, [values, conf]);

  return (
    <form onSubmit={handleSubmit(setConf)}>
      <Stack spacing="xs">
        <Group position="left" py="md" pl="md" sx={{ borderBottom: '1px solid #eee', background: '#efefef' }}>
          <Text>Radar Config</Text>
          <ActionIcon type="submit" mr={5} variant="filled" color="blue" disabled={!changed}>
            <DeviceFloppy size={20} />
          </ActionIcon>
        </Group>
        <Tabs defaultValue="series">
          <Tabs.List>
            <Tabs.Tab value="series">Series</Tabs.Tab>
            <Tabs.Tab value="metrics">Metrics</Tabs.Tab>
            <Tabs.Tab value="style">Style</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="series" p="md">
            <Controller
              name="series_name_key"
              control={control}
              render={({ field }) => (
                <DataFieldSelector label="Series Name Field" required sx={{ flex: 1 }} {...field} />
              )}
            />
          </Tabs.Panel>

          <Tabs.Panel value="metrics" p="md">
            <DimensionsField control={control} watch={watch} />
          </Tabs.Panel>

          <Tabs.Panel value="style" p="md">
            <Group grow noWrap>
              <Controller
                name="background.enabled"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    label="Show background"
                    checked={field.value}
                    onChange={(event) => field.onChange(event.currentTarget.checked)}
                  />
                )}
              />
              <Controller
                name="label.enabled"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    label="Show value label"
                    checked={field.value}
                    onChange={(event) => field.onChange(event.currentTarget.checked)}
                  />
                )}
              />
            </Group>
          </Tabs.Panel>
        </Tabs>
      </Stack>
    </form>
  );
}
