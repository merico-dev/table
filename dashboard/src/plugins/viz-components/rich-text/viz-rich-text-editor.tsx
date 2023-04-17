import { ActionIcon, Group, Stack, Text } from '@mantine/core';
import { defaults } from 'lodash';
import { useEffect, useMemo, useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { DeviceFloppy } from 'tabler-icons-react';
import { CustomRichTextEditor } from '~/panel/settings/common/custom-rich-text-editor';
import { useStorageData } from '~/plugins/hooks';
import { VizConfigProps } from '~/types/plugin';
import { DEFAULT_CONFIG, IRichTextConf } from './type';

export function VizRichTextEditor({ context }: VizConfigProps) {
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
          <Text>Content</Text>
          <ActionIcon ref={submitButton} type="submit" mr={5} variant="filled" color="blue">
            <DeviceFloppy size={20} />
          </ActionIcon>
        </Group>
        <Controller
          name="content"
          control={control}
          render={({ field }) => (
            <CustomRichTextEditor
              {...field}
              styles={{ root: { flexGrow: 1 } }}
              label="Content"
              onSubmit={onContentSubmit}
            />
          )}
        />
      </Stack>
    </form>
  );
}
