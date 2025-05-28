import _ from 'lodash';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useStorageData } from '~/components/plugins';
import { VizConfigProps } from '~/types/plugin';
import { VizConfigBanner } from '../../../editor-components';
import { DEFAULT_CONFIG, IVizDashboardStateConf } from '../type';
import { Fields } from './fields';

export function VizVizDashboardStateEditor({ context }: VizConfigProps) {
  const { value: confValue, set: setConf } = useStorageData<IVizDashboardStateConf>(context.instanceData, 'config');
  const conf: IVizDashboardStateConf = useMemo(() => _.defaultsDeep({}, confValue, DEFAULT_CONFIG), [confValue]);

  const form = useForm<IVizDashboardStateConf>({
    defaultValues: conf,
  });
  const { handleSubmit, formState, reset } = form;
  useEffect(() => {
    reset(conf);
  }, [conf]);

  return (
    <form onSubmit={handleSubmit(setConf)}>
      <VizConfigBanner canSubmit={formState.isDirty} />
      <Fields form={form} />
    </form>
  );
}
