import { Stack } from '@mantine/core';
import _ from 'lodash';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { VizConfigProps } from '~/types/plugin';
import { ChartConfigBanner } from '../../editor-components';
import { useStorageData } from '../../hooks';
import { SeriesField } from './editors/series';
import { DEFAULT_CONFIG, IFunnelConf } from './type';

export function VizFunnelEditor({ context }: VizConfigProps) {
  const { value: confValue, set: setConf } = useStorageData<IFunnelConf>(context.instanceData, 'config');
  const { variables } = context;
  const conf: IFunnelConf = useMemo(() => _.defaultsDeep({}, confValue, DEFAULT_CONFIG), [confValue]);

  const { control, handleSubmit, watch, getValues, reset } = useForm<IFunnelConf>({ defaultValues: conf });
  useEffect(() => {
    reset(conf);
  }, [conf]);

  watch([]);
  const values = getValues();
  const changed = useMemo(() => {
    return !_.isEqual(values, conf);
  }, [values, conf]);

  return (
    <Stack spacing="xs">
      <form onSubmit={handleSubmit(setConf)}>
        <ChartConfigBanner canSubmit={changed} />
        {/* <Tabs
          defaultValue="Basics"
          orientation="vertical"
          styles={{
            tab: {
              paddingLeft: '6px',
              paddingRight: '6px',
            },
            panel: {
              paddingTop: '6px',
              paddingLeft: '12px',
            },
          }}
        >
          <Tabs.List>
            <Tabs.Tab value="Basics">Basics</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="Basics">Basic settings</Tabs.Panel>
        </Tabs> */}
        <SeriesField control={control} watch={watch} />
      </form>
    </Stack>
  );
}
