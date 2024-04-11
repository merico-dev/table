import { ActionIcon, Divider, Group, Stack, Text, TextInput } from '@mantine/core';
import _, { defaultsDeep, isEqual } from 'lodash';
import React, { useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { DeviceFloppy } from 'tabler-icons-react';
import { MantineFontWeightSlider } from '~/components/panel/settings/common/mantine-font-weight';
import { useStorageData } from '~/components/plugins/hooks';
import { VizConfigProps } from '~/types/plugin';
import { HorizontalAlignSelector, VizConfigBanner } from '../../editor-components';
import { FuncContentField } from './editors/func-content';
import { DEFAULT_CONFIG, IVizTextConf } from './type';
import { useTranslation } from 'react-i18next';

export function VizTextEditor({ context }: VizConfigProps) {
  const { t } = useTranslation();
  const { value: confValue, set: setConf } = useStorageData<IVizTextConf>(context.instanceData, 'config');
  const conf: IVizTextConf = useMemo(() => defaultsDeep({}, confValue, DEFAULT_CONFIG), [confValue]);
  const defaultValues: IVizTextConf = useMemo(() => {
    const { func_content, horizontal_align, font_size, font_weight } = conf;
    return { func_content, horizontal_align, font_size, font_weight };
  }, [conf]);

  useEffect(() => {
    const configMalformed = !isEqual(conf, defaultValues);
    if (configMalformed) {
      console.log('config malformed, resetting to defaults', conf, defaultValues);
      void setConf(defaultValues);
    }
  }, [conf, defaultValues]);

  const { control, handleSubmit, watch, getValues, reset } = useForm<IVizTextConf>({ defaultValues });

  React.useEffect(() => {
    reset(defaultValues);
  }, [defaultValues]);

  watch(['func_content', 'horizontal_align', 'font_size', 'font_weight']);
  const values = getValues();
  const changed = React.useMemo(() => {
    return !_.isEqual(values, conf);
  }, [values, conf]);

  return (
    <Stack spacing="xs">
      <form onSubmit={handleSubmit(setConf)}>
        <VizConfigBanner canSubmit={changed} />
        <Stack spacing={10}>
          <Controller name="func_content" control={control} render={({ field }) => <FuncContentField {...field} />} />
          <Divider mt={10} mb={-10} variant="dashed" label={t('chart.style.label')} labelPosition="center" />
          <Controller
            name="horizontal_align"
            control={control}
            render={({ field }) => <HorizontalAlignSelector {...field} />}
          />
          <Controller
            name="font_size"
            control={control}
            render={({ field }) => (
              <TextInput
                label={t('style.font_size.label')}
                placeholder={t('style.font_size.placeholder')}
                sx={{ flex: 1 }}
                {...field}
              />
            )}
          />
          <Group position="apart" grow sx={{ '> *': { flexGrow: 1, maxWidth: '100%' } }}>
            <Controller
              name="font_weight"
              control={control}
              render={({ field }) => <MantineFontWeightSlider label={t('style.font_weight.label')} {...field} />}
            />
          </Group>
        </Stack>
      </form>
    </Stack>
  );
}
