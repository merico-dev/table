import { Stack } from '@mantine/core';
import { defaultsDeep } from 'lodash';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';

import { useStorageData } from '~/components/plugins/hooks';
import { VizConfigProps } from '~/types/plugin';
import { VizConfigBanner } from '../../editor-components';
import { MetricsField } from './editors/metrics';
import { StylesField } from './editors/styles';
import { DEFAULT_CONFIG, TMericoStatsConf } from './type';

export function VizMericoStatsEditor({ context }: VizConfigProps) {
  const { value: confValue, set: setConf } = useStorageData<TMericoStatsConf>(context.instanceData, 'config');
  const { variables } = context;
  const conf: TMericoStatsConf = useMemo(() => defaultsDeep({}, confValue, DEFAULT_CONFIG), [confValue]);

  const { control, handleSubmit, watch, formState, reset } = useForm<TMericoStatsConf>({ defaultValues: conf });
  useEffect(() => {
    reset(conf);
  }, [conf]);

  return (
    <form onSubmit={handleSubmit(setConf)}>
      <Stack spacing="xs">
        <VizConfigBanner canSubmit={formState.isDirty} />
        <StylesField control={control} watch={watch} />
        <MetricsField control={control} watch={watch} variables={variables} />
      </Stack>
    </form>
  );
}
