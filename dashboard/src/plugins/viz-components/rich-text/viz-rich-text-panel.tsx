import { ActionIcon, Group, Stack, Text } from '@mantine/core';
import { defaults, isEqual } from 'lodash';
import { useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { DeviceFloppy } from 'tabler-icons-react';
import { CustomRichTextEditor } from '~/panel/settings/common/custom-rich-text-editor';
import { useStorageData } from '~/plugins/hooks';
import { VizConfigProps } from '~/types/plugin';
import { DEFAULT_CONFIG, IRichTextConf } from './type';

export function VizRichTextPanel({ context }: VizConfigProps) {
  const { value: conf, set: setConf } = useStorageData<IRichTextConf>(context.instanceData, 'config');
  const defaultValues = useMemo(() => {
    return defaults({}, conf, DEFAULT_CONFIG);
  }, [conf]);

  const { control, handleSubmit, watch, getValues, reset } = useForm<IRichTextConf>({ defaultValues });
  watch('content');
  const values = getValues();
  const changed = useMemo(() => {
    return !isEqual(values.content, defaultValues.content);
  }, [values, defaultValues]);

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues]);

  return (
    <form onSubmit={handleSubmit(setConf)} style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
      <Stack mt="md" spacing="xs" sx={{ flexGrow: 1 }}>
        <Group position="left" py="md" pl="md" sx={{ borderBottom: '1px solid #eee', background: '#efefef' }}>
          <Text>Content</Text>
          <ActionIcon type="submit" mr={5} variant="filled" color="blue" disabled={!changed}>
            <DeviceFloppy size={20} />
          </ActionIcon>
        </Group>
        <Controller
          name="content"
          control={control}
          render={({ field }) => <CustomRichTextEditor {...field} styles={{ root: { flexGrow: 1 } }} />}
        />
      </Stack>
    </form>
  );
}
