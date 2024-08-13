import { Stack, Tabs } from '@mantine/core';
import _, { defaultsDeep } from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useStorageData } from '~/components/plugins/hooks';
import { VizConfigProps } from '~/types/plugin';
import { VizConfigBanner } from '../../editor-components';
import { DataField } from './editors/data-field';
import { LevelsField } from './editors/levels';
import { DEFAULT_CONFIG, ISunburstConf } from './type';

export function VizSunburstEditor({ context }: VizConfigProps) {
  const { t } = useTranslation();
  const { value: confValue, set: setConf } = useStorageData<ISunburstConf>(context.instanceData, 'config');
  const { variables } = context;
  const conf: ISunburstConf = useMemo(() => defaultsDeep({}, confValue, DEFAULT_CONFIG), [confValue]);
  const defaultValues: ISunburstConf = useMemo(() => _.clone(conf), [conf]);

  const { control, handleSubmit, watch, formState, reset } = useForm<ISunburstConf>({ defaultValues });
  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues]);

  watch(['label_key', 'value_key', 'group_key', 'levels']);

  const [tab, setTab] = useState<string | null>('Data');
  return (
    <form onSubmit={handleSubmit(setConf)}>
      <Stack spacing="xs">
        <VizConfigBanner canSubmit={formState.isDirty} />
        <Tabs
          value={tab}
          onTabChange={setTab}
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
            <Tabs.Tab value="Data">{t('data.label')}</Tabs.Tab>
            <Tabs.Tab value="Levels">{t('viz.sunburst_chart.level.labels')}</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="Data">
            <DataField control={control} watch={watch} />
          </Tabs.Panel>
          <Tabs.Panel value="Levels">
            <LevelsField control={control} watch={watch} />
          </Tabs.Panel>
        </Tabs>
      </Stack>
    </form>
  );
}
