import { Stack } from '@mantine/core';
import _, { defaultsDeep } from 'lodash';
import React, { useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useStorageData } from '~/components/plugins/hooks';
import { CustomRichTextEditor } from '~/components/widgets';
import { VizConfigProps } from '~/types/plugin';
import { VerticalAlignSelector, VizConfigBanner } from '../../editor-components';
import { DEFAULT_CONFIG, IVizStatsConf } from './type';

export function VizStatsEditor({ context }: VizConfigProps) {
  const { t } = useTranslation();
  const { value: conf, set: setConf } = useStorageData<IVizStatsConf>(context.instanceData, 'config');

  const defaultValues = React.useMemo(() => {
    return defaultsDeep({}, conf, DEFAULT_CONFIG);
  }, [conf]);

  const { control, handleSubmit, watch, getValues, reset } = useForm<IVizStatsConf>({ defaultValues });

  React.useEffect(() => {
    reset(defaultValues);
  }, [defaultValues]);

  watch(['content', 'vertical_align']);
  const values = getValues();
  const changed = React.useMemo(() => {
    return !_.isEqual(values, conf);
  }, [values, conf]);

  const submitButton = useRef<HTMLButtonElement>(null);
  const onContentSubmit = () => submitButton.current?.click();
  return (
    <form onSubmit={handleSubmit(setConf)}>
      <Stack spacing="xs">
        <VizConfigBanner canSubmit={changed} buttonRef={submitButton} />
        <Controller
          control={control}
          name="vertical_align"
          render={({ field }) => <VerticalAlignSelector {...field} />}
        />
        <Controller
          name="content"
          control={control}
          render={({ field }) => (
            <CustomRichTextEditor
              {...field}
              styles={{ root: { flexGrow: 1, minHeight: '240px' } }}
              label={t('rich_text.content.label')}
              onSubmit={onContentSubmit}
            />
          )}
        />
      </Stack>
    </form>
  );
}
