import { ActionIcon, Group, Stack, Text } from '@mantine/core';
import { IconDeviceFloppy } from '@tabler/icons-react';
import { defaults } from 'lodash';
import { useEffect, useMemo, useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useStorageData } from '~/components/plugins/hooks';
import { CustomRichTextEditor } from '~/components/widgets/rich-text-editor/custom-rich-text-editor';
import { VizConfigProps } from '~/types/plugin';
import { DEFAULT_CONFIG, IRichTextConf } from './type';
import { observer } from 'mobx-react-lite';
import { useEditPanelContext } from '~/contexts';

export const VizRichTextEditor = observer(({ context }: VizConfigProps) => {
  const { panel } = useEditPanelContext();
  const { t } = useTranslation();
  const { value: conf, set: setConf } = useStorageData<IRichTextConf>(context.instanceData, 'config');
  const defaultValues = useMemo(() => {
    return defaults({}, conf, DEFAULT_CONFIG);
  }, [conf]);

  const { control, handleSubmit, watch, reset } = useForm<IRichTextConf>({ defaultValues });
  watch('content');

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues]);

  const submitButton = useRef<HTMLButtonElement>(null);
  const onContentSubmit = () => submitButton.current?.click();
  return (
    <form onSubmit={handleSubmit(setConf)} style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
      <Stack spacing="xs" sx={{ flexGrow: 1 }}>
        <Group
          position="left"
          py="md"
          pl="md"
          sx={{ borderBottom: '1px solid #eee', background: '#efefef', display: 'none' }}
        >
          <Text>{t('rich_text.content.label')}</Text>
          <ActionIcon ref={submitButton} type="submit" mr={5} variant="filled" color="blue">
            <IconDeviceFloppy size={20} />
          </ActionIcon>
        </Group>
        <Controller
          name="content"
          control={control}
          render={({ field }) => (
            <CustomRichTextEditor
              {...field}
              key={panel.id}
              styles={{ root: { flexGrow: 1 } }}
              label={t('rich_text.content.label')}
              onSubmit={onContentSubmit}
            />
          )}
        />
      </Stack>
    </form>
  );
});
