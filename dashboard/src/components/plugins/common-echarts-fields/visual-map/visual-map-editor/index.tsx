import { Checkbox, Group, NumberInput, Stack, TextInput } from '@mantine/core';
import { Controller, UseFormReturn } from 'react-hook-form';
import { OrientationSelector } from '../../orientation';
import { GrandientEditor } from './gradient-editor';
import { PreviewVisualMap } from './preview-visual-map';
import { VisualMapPartialForm } from './types';

type Props = {
  form: UseFormReturn<VisualMapPartialForm>;
};

export const VisualMapEditor = ({ form }: Props) => {
  const control = form.control;
  const visualMap = form.watch('visualMap');
  const { orient } = visualMap;
  const isHorizontal = orient === 'horizontal';
  const getNumberChanger = (handleChange: (n: number) => void) => (v: number | '') => {
    if (v === '') {
      return;
    }
    handleChange(v);
  };
  return (
    <Stack>
      <Group align="top">
        <PreviewVisualMap visualMap={visualMap} />
        <Group grow>
          <Controller
            name="visualMap.orient"
            control={control}
            render={({ field }) => <OrientationSelector sx={{ flex: 1 }} {...field} />}
          />
          <Controller
            name="visualMap.calculable"
            control={control}
            render={({ field }) => (
              <Checkbox
                label="show drag handle"
                checked={field.value}
                onChange={(event) => field.onChange(event.currentTarget.checked)}
                styles={{ root: { transform: 'translateY(12px)' } }}
              />
            )}
          />
        </Group>
        <Group
          styles={{
            root: {
              flexDirection: isHorizontal ? 'row-reverse' : 'row',
            },
          }}
        >
          <Controller
            name="visualMap.itemWidth"
            control={control}
            render={({ field }) => (
              <NumberInput
                label={isHorizontal ? 'item height' : 'item width'}
                {...field}
                onChange={getNumberChanger(field.onChange)}
              />
            )}
          />
          <Controller
            name="visualMap.itemHeight"
            control={control}
            render={({ field }) => (
              <NumberInput
                label={isHorizontal ? 'item width' : 'item height'}
                {...field}
                onChange={getNumberChanger(field.onChange)}
              />
            )}
          />
        </Group>
        <Group>
          <Controller
            name="visualMap.min"
            control={control}
            render={({ field }) => <NumberInput label="min" {...field} onChange={getNumberChanger(field.onChange)} />}
          />
          <Controller
            name="visualMap.max"
            control={control}
            render={({ field }) => <NumberInput label="max" {...field} onChange={getNumberChanger(field.onChange)} />}
          />
        </Group>
        <Group grow>
          <Controller
            name="visualMap.text.1"
            control={control}
            render={({ field }) => <TextInput label="min text" {...field} />}
          />
          <Controller
            name="visualMap.text.0"
            control={control}
            render={({ field }) => <TextInput label="max text" {...field} />}
          />
        </Group>

        <GrandientEditor name="visualMap.inRange.color" form={form} />
      </Group>
      {/* <pre>{JSON.stringify(options, null, 2)}</pre> */}
    </Stack>
  );
};
