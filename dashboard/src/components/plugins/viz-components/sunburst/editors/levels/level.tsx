import { Button, Divider, Group, NumberInput, Select, Stack, TextInput } from '@mantine/core';
import { Control, Controller } from 'react-hook-form';
import { Trash } from 'tabler-icons-react';
import { LabelPositionSelector } from '~/components/plugins/common-echarts-fields/label-position';
import { ISunburstConf } from '../../type';

const rotationOptions = [
  { label: 'Radial', value: 'radial' },
  { label: 'Tangential', value: 'tangential' },
  { label: 'None', value: '0' },
];

const alignmentOptions = [
  { label: 'Left', value: 'left' },
  { label: 'Center', value: 'center' },
  { label: 'Right', value: 'right' },
];

interface ILevelField {
  control: Control<ISunburstConf, $TSFixMe>;
  index: number;
  remove: (index: number) => void;
}

export const LevelField = ({ control, index, remove }: ILevelField) => {
  return (
    <Stack>
      <Group grow noWrap>
        <Controller
          name={`levels.${index}.r0`}
          control={control}
          render={({ field }) => <TextInput label="Inside Radius" placeholder="0%" {...field} />}
        />
        <Controller
          name={`levels.${index}.r`}
          control={control}
          render={({ field }) => <TextInput label="Outside Radius" placeholder="50%" {...field} />}
        />
      </Group>
      <Divider mb={-10} mt={10} variant="dashed" label="Label Style" labelPosition="center" />
      <Controller
        name={`levels.${index}.label.show_label_tolerance`}
        control={control}
        render={({ field }) => (
          // @ts-expect-error type of onChange
          <NumberInput
            label="Hide label when its percentage is less than..."
            precision={4}
            step={0.0005}
            min={0}
            max={1}
            {...field}
          />
        )}
      />
      <Group grow noWrap>
        <Controller
          name={`levels.${index}.label.rotate`}
          control={control}
          // @ts-expect-error type of onChange
          render={({ field }) => <Select label="Rotate" data={rotationOptions} {...field} />}
        />
        <Controller
          name={`levels.${index}.label.align`}
          control={control}
          // @ts-expect-error type of onChange
          render={({ field }) => <Select label="Align" data={alignmentOptions} {...field} />}
        />
      </Group>
      <Group grow noWrap>
        <Controller
          name={`levels.${index}.label.position`}
          control={control}
          render={({ field }) => <LabelPositionSelector label="Position" {...field} />}
        />
        <Controller
          name={`levels.${index}.label.padding`}
          control={control}
          // @ts-expect-error type of onChange
          render={({ field }) => <NumberInput label="Padding" min={0} hideControls {...field} />}
        />
      </Group>
      <Divider mb={-10} mt={10} variant="dashed" />
      <Button
        leftIcon={<Trash size={16} />}
        color="red"
        variant="light"
        onClick={() => remove(index)}
        sx={{ top: 15, right: 5 }}
      >
        Delete this Level
      </Button>
    </Stack>
  );
};
