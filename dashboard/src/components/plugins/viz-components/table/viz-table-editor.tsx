import { ActionIcon, Divider, Group, Tabs, Text } from '@mantine/core';
import { randomId } from '@mantine/hooks';
import { defaultsDeep, isEqual } from 'lodash';
import { useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { DeviceFloppy } from 'tabler-icons-react';
import { DataFieldSelector } from '~/components/panel/settings/common/data-field-selector';
import { useStorageData } from '~/components/plugins/hooks';
import { VizConfigProps } from '~/types/plugin';
import { ColumnsField } from './editors/columns';
import { StylingFields } from './editors/styling';
import { DEFAULT_CONFIG, ITableConf } from './type';
import { VizConfigBanner } from '../../editor-components';
import { useTranslation } from 'react-i18next';

// FIXME: migrator to version 2 in index.ts doesn't work
function tempMigration({ columns, ...rest }: ITableConf) {
  return {
    ...rest,
    columns: columns.map(({ id, ...restColumn }) => ({
      id: id ?? randomId(),
      ...restColumn,
    })),
  };
}

export function VizTableEditor({ context }: VizConfigProps) {
  const { t } = useTranslation();
  const { value: confValue, set: setConf } = useStorageData<ITableConf>(context.instanceData, 'config');
  // const { variables } = context;
  const conf: ITableConf = useMemo(() => defaultsDeep({}, confValue, DEFAULT_CONFIG), [confValue]);
  const defaultValues: ITableConf = useMemo(() => {
    return tempMigration(conf);
  }, [conf]);

  useEffect(() => {
    const configMalformed = !isEqual(conf, defaultValues);
    if (configMalformed) {
      console.log('config malformed, resetting to defaults', conf, defaultValues);
      void setConf(defaultValues);
    }
  }, [conf, defaultValues]);

  const { control, handleSubmit, watch, getValues, reset } = useForm<ITableConf>({ defaultValues });
  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues]);

  const values = getValues();
  const changed = useMemo(() => {
    return !isEqual(values, conf);
  }, [values, conf]);

  watch(['id_field']);
  return (
    <form onSubmit={handleSubmit(setConf)}>
      <VizConfigBanner canSubmit={changed} />
      <Tabs
        defaultValue="Columns"
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
          <Tabs.Tab value="Columns">{t('viz.table.column.labels')}</Tabs.Tab>
          <Tabs.Tab value="Style">{t('style.label')}</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="Columns">
          <Controller
            name="id_field"
            control={control}
            render={({ field }) => (
              <DataFieldSelector
                label={t('viz.table.column.id_field')}
                description={t('viz.table.column.id_field_hint')}
                required
                {...field}
              />
            )}
          />
          <Divider mt={20} mb={10} variant="dashed" />
          <ColumnsField control={control} watch={watch} />
        </Tabs.Panel>

        <Tabs.Panel value="Style">
          <StylingFields control={control} watch={watch} />
        </Tabs.Panel>
      </Tabs>
    </form>
  );
}
