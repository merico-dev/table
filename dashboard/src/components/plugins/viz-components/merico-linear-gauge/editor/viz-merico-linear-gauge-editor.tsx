import { Stack } from '@mantine/core';
import _ from 'lodash';
import { useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useStorageData } from '~/components/plugins';
import { VizConfigProps } from '~/types/plugin';
import { VizConfigBanner } from '../../../editor-components';
import { getDefaultConfig, IVizMericoLinearGaugeConf } from '../type';
import { SectionsEditor } from './sections-editor';
import { CustomRichTextEditor } from '~/components/widgets';
import { useTranslation } from 'react-i18next';

export function VizMericoLinearGaugeEditor({ context }: VizConfigProps) {
  const { value: confValue, set: setConf } = useStorageData<IVizMericoLinearGaugeConf>(context.instanceData, 'config');
  const { t } = useTranslation();
  const { variables } = context;
  const data = context.data;
  const conf: IVizMericoLinearGaugeConf = useMemo(() => _.defaultsDeep({}, confValue, getDefaultConfig()), [confValue]);

  const form = useForm<IVizMericoLinearGaugeConf>({
    defaultValues: conf,
  });
  const { handleSubmit, formState, reset } = form;
  useEffect(() => {
    form.reset(conf);
  }, [conf]);

  const sections = form.watch();

  return (
    <form onSubmit={handleSubmit(setConf)}>
      <VizConfigBanner canSubmit={formState.isDirty} />
      <Stack gap="lg" pt="xs" px="xs">
        <Controller
          name="stats.top"
          control={form.control}
          render={({ field }) => (
            <CustomRichTextEditor
              key={'stats.top'}
              label={t('chart.stats.template.above_chart')}
              styles={{ root: { flexGrow: 1, minHeight: '240px' } }}
              autoSubmit
              {...field}
            />
          )}
        />
        <Controller
          name="sections"
          control={form.control}
          render={({ field }) => <SectionsEditor {...field} data={data} />}
        />
      </Stack>
    </form>
  );
}
