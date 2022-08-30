import { ActionIcon, Group, Stack, Text } from '@mantine/core';
import RichTextEditor from '@mantine/rte';
import { defaults, isEqual, omit } from 'lodash';
import { useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { DeviceFloppy } from 'tabler-icons-react';
import { VizConfigProps } from '../../../types/plugin';
import { useStorageData } from '../../hooks';
import { useSyncEditorContent } from './hooks';
import { DEFAULT_CONFIG, IRichTextConf } from './type';

export function VizRichTextPanel({ context }: VizConfigProps) {
  const { value: conf, set: setConf } = useStorageData<IRichTextConf>(context.instanceData, 'config');
  const defaultValues = useMemo(() => {
    return defaults({}, conf, DEFAULT_CONFIG);
  }, [conf]);

  const { control, handleSubmit, watch, getValues } = useForm<IRichTextConf>({ defaultValues });
  watch('content');
  const values = getValues();
  const changed = useMemo(() => {
    return !isEqual(values, conf);
  }, [values, conf]);
  const editorRef = useSyncEditorContent(conf?.content);

  return (
    <Stack mt="md" spacing="xs">
      <form onSubmit={handleSubmit(setConf)}>
        <Group position="left" py="md" pl="md" sx={{ borderBottom: '1px solid #eee', background: '#efefef' }}>
          <Text>Content</Text>
          <ActionIcon type="submit" mr={5} variant="filled" color="blue" disabled={!changed}>
            <DeviceFloppy size={20} />
          </ActionIcon>
        </Group>
        <Controller
          name="content"
          control={control}
          render={({ field }) => <RichTextEditor ref={editorRef} sx={{ flex: 1 }} {...omit(field, 'ref')} />}
        />
      </form>
    </Stack>
  );
}
