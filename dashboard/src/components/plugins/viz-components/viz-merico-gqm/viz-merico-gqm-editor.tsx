import { Button, Divider, Group, Stack, TextInput } from '@mantine/core';
import { defaultsDeep, isEqual } from 'lodash';
import { useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { DeviceFloppy } from 'tabler-icons-react';
import { VizConfigProps } from '~/types/plugin';
import { useStorageData } from '../../hooks';
import { DEFAULT_CONFIG, IMericoGQMConf } from './type';

export function VizMericoGQMEditor({ context }: VizConfigProps) {
  const { value: confValue, set: setConf } = useStorageData<IMericoGQMConf>(context.instanceData, 'config');
  const defaultValues: IMericoGQMConf = useMemo(() => defaultsDeep({}, confValue, DEFAULT_CONFIG), [confValue]);

  const { control, handleSubmit, watch, getValues, reset } = useForm<IMericoGQMConf>({ defaultValues });
  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues]);

  watch(['expertSystemURL', 'goal', 'path', 'question']);

  const values = getValues();
  const changed = useMemo(() => {
    return !isEqual(values, defaultValues);
  }, [values, defaultValues]);

  return (
    <form onSubmit={handleSubmit(setConf)}>
      <Stack>
        <Group grow>
          <Controller
            name="expertSystemURL"
            control={control}
            render={({ field }) => <TextInput label="Expert System URL" {...field} />}
          />
          <Controller
            name="path"
            control={control}
            render={({ field }) => <TextInput label="Path" required {...field} />}
          />
        </Group>
        <Group grow>
          <Controller
            name="goal"
            control={control}
            render={({ field }) => <TextInput label="Goal" required {...field} />}
          />
          <Controller
            name="question"
            control={control}
            render={({ field }) => <TextInput label="Question" required {...field} />}
          />
        </Group>
        <Divider variant="dashed" mt={16} mb={8} />
        <Button
          type="submit"
          variant="filled"
          color="blue"
          leftIcon={<DeviceFloppy size={20} />}
          disabled={!changed}
          sx={{ alignSelf: 'flex-end' }}
        >
          Submit Changes
        </Button>
      </Stack>
    </form>
  );
}
