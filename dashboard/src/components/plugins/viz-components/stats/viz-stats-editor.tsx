import { Stack } from '@mantine/core';
import { defaults } from 'lodash';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useStorageData } from '~/components/plugins/hooks';
import { CustomRichTextEditor } from '~/components/widgets';
import { VizConfigProps } from '~/types/plugin';
import { VerticalAlignSelector, VizConfigBanner } from '../../editor-components';
import { IVizStatsConf } from './type';
import { observer } from 'mobx-react-lite';
import { useEditPanelContext } from '~/contexts';

type StorageData = ReturnType<typeof useStorageData<IVizStatsConf>>;

type EditorProps = {
  conf: StorageData['value'];
  setConf: StorageData['set'];
};
const Editor = observer(({ conf, setConf }: EditorProps) => {
  const { panel } = useEditPanelContext();
  const { t } = useTranslation();

  const defaultValues = React.useMemo(() => {
    return defaults({}, conf);
  }, [conf]);
  const { control, handleSubmit, watch, formState, reset } = useForm<IVizStatsConf>({ defaultValues });
  React.useEffect(() => {
    reset(defaultValues);
  }, [defaultValues]);

  watch(['content', 'vertical_align']);
  return (
    <form onSubmit={handleSubmit(setConf)}>
      <Stack spacing="xs">
        <VizConfigBanner canSubmit={formState.isDirty} />
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
              key={panel.id}
              styles={{ root: { flexGrow: 1, minHeight: '240px' } }}
              label={t('rich_text.content.label')}
              autoSubmit
            />
          )}
        />
      </Stack>
    </form>
  );
});

export function VizStatsEditor(props: VizConfigProps) {
  const { value, set } = useStorageData<IVizStatsConf>(props.context.instanceData, 'config');
  if (!value) {
    return null;
  }
  return <Editor conf={value} setConf={set} />;
}
