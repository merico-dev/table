import _ from 'lodash';
import { useEffect, useMemo } from 'react';
import { ActionIcon, Group, Stack, Tabs, Text } from '@mantine/core';
import { useForm } from 'react-hook-form';
import { AnyObject } from '~/types';
import { VizConfigProps } from '~/types/plugin';
import { VizConfigBanner } from '../../../editor-components';
import { useStorageData } from '~/components/plugins';
import { getDefaultConfig, IVizMericoLinearGaugeConf } from '../type';

export function VizMericoLinearGaugeEditor({ context }: VizConfigProps) {
  const { value: confValue, set: setConf } = useStorageData<IVizMericoLinearGaugeConf>(context.instanceData, 'config');
  const { variables } = context;
  const data = context.data;
  const conf: IVizMericoLinearGaugeConf = useMemo(() => _.defaultsDeep({}, confValue, getDefaultConfig()), [confValue]);

  const { control, handleSubmit, watch, getValues, formState, reset } = useForm<IVizMericoLinearGaugeConf>({
    defaultValues: conf,
  });
  useEffect(() => {
    reset(conf);
  }, [conf]);

  return (
    <Stack gap="xs">
      <form onSubmit={handleSubmit(setConf)}>
        <VizConfigBanner canSubmit={formState.isDirty} />
        <Tabs
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
        </Tabs>
      </form>
    </Stack>
  );
}
