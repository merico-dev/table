import { Stack } from '@mantine/core';
import _ from 'lodash';
import { useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useStorageData } from '~/components/plugins';
import { VizConfigProps } from '~/types/plugin';
import { VizConfigBanner } from '../../../editor-components';
import { getDefaultConfig, VizMericoPanelGroupsConf } from '../type';
import { GroupsEditor } from './groups-editor';

export function VizMericoPanelGroupsEditor({ context }: VizConfigProps) {
  const { value: confValue, set: setConf } = useStorageData<VizMericoPanelGroupsConf>(context.instanceData, 'config');
  const { t } = useTranslation();
  const { variables } = context;
  const data = context.data;
  const conf: VizMericoPanelGroupsConf = useMemo(() => _.defaultsDeep({}, confValue, getDefaultConfig()), [confValue]);

  const form = useForm<VizMericoPanelGroupsConf>({
    defaultValues: conf,
  });
  const { handleSubmit, formState, reset } = form;
  useEffect(() => {
    form.reset(conf);
  }, [conf]);

  return (
    <form onSubmit={handleSubmit(setConf)}>
      <VizConfigBanner canSubmit={formState.isDirty} />
      <Stack gap="lg" pt="xs" px="xs">
        <Controller
          name="groups"
          control={form.control}
          render={({ field }) => <GroupsEditor {...field} data={data} />}
        />
      </Stack>
    </form>
  );
}
