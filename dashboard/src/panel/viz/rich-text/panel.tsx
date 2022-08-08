import { ActionIcon, Group, Stack, Text } from '@mantine/core';
import { Controller, useForm } from 'react-hook-form';
import _ from 'lodash';
import React from 'react';
import { DeviceFloppy } from 'tabler-icons-react';
import { IRichTextConf, IVizRichTextPanel } from './type';
import RichTextEditor from '@mantine/rte';

export function VizRichTextPanel({ conf, setConf }: IVizRichTextPanel) {
  const defaultValues = React.useMemo(() => {
    const { content = '' } = conf;
    return { content };
  }, [conf]);

  React.useEffect(() => {
    const configMalformed = !_.isEqual(conf, defaultValues);
    if (configMalformed) {
      setConf(defaultValues);
    }
  }, [conf, defaultValues]);

  const { control, handleSubmit, watch, getValues } = useForm<IRichTextConf>({ defaultValues });

  watch('content');
  const values = getValues();
  const changed = React.useMemo(() => {
    return !_.isEqual(values, conf);
  }, [values, conf]);

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
          render={({ field }) => <RichTextEditor sx={{ flex: 1 }} {...field} />}
        />
      </form>
    </Stack>
  );
}
