import { Stack } from '@mantine/core';
import _ from 'lodash';
import { useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useStorageData } from '~/components/plugins';
import { VizConfigProps } from '~/types/plugin';
import { VizConfigBanner } from '../../../editor-components';
import { getDefaultConfig, IVizMericoLinearGaugeConf } from '../type';
import { SectionsEditor } from './sections-editor';

export function VizMericoLinearGaugeEditor({ context }: VizConfigProps) {
  const { value: confValue, set: setConf } = useStorageData<IVizMericoLinearGaugeConf>(context.instanceData, 'config');
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
    <Stack gap="xs">
      <form onSubmit={handleSubmit(setConf)}>
        <VizConfigBanner canSubmit={formState.isDirty} />
        <Controller
          name="sections"
          control={form.control}
          render={({ field }) => <SectionsEditor {...field} data={data} />}
        />
      </form>
    </Stack>
  );
}
