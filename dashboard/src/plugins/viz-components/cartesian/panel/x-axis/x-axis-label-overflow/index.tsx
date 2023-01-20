import { Divider, Group, NumberInput, Select, Stack, TextInput } from '@mantine/core';
import _ from 'lodash';
import { forwardRef } from 'react';
import { IXAxisLabelOverflow } from './types';

const overflowOptions = [
  { label: 'Truncate', value: 'truncate' },
  { label: 'Break Line', value: 'break' },
  { label: 'Break Word', value: 'breakAll' },
];

interface IXAxisLabelOverflowField {
  value: IXAxisLabelOverflow;
  onChange: (v: IXAxisLabelOverflow) => void;
}

export const XAxisLabelOverflowField = forwardRef(({ value, onChange }: IXAxisLabelOverflowField, ref: any) => {
  const getChangeHandler = (path: string) => (v: any) => {
    const newV = _.cloneDeep(value);
    _.set(newV, path, v);
    console.log({
      prev: value,
      next: newV,
    });
    onChange(newV);
  };
  return (
    <Stack ref={ref}>
      <Stack spacing={0}>
        <Divider
          mb={-5}
          mt={5}
          variant="dotted"
          label="Overflow on XAxis"
          labelPosition="right"
          labelProps={{ color: 'dimmed' }}
        />
        <Group noWrap>
          <NumberInput
            label="Max Width"
            hideControls
            value={value.x_axis.width}
            onChange={getChangeHandler('x_axis.width')}
          />
          <Select
            label="Overflow"
            data={overflowOptions}
            value={value.x_axis.overflow}
            onChange={getChangeHandler('x_axis.overflow')}
          />
          <TextInput
            label="Ellipsis"
            value={value.x_axis.ellipsis}
            // onChange={(e) => getChangeHandler('x_axis.ellipsis')(e.currentTarget.value)}
            disabled
          />
        </Group>
        <Divider
          mb={-5}
          mt={5}
          variant="dotted"
          label="Overflow in Tooltip"
          labelPosition="right"
          labelProps={{ color: 'dimmed' }}
        />
        <Group noWrap>
          <NumberInput
            label="Max Width"
            hideControls
            value={value.tooltip.width}
            onChange={getChangeHandler('tooltip.width')}
          />
          <Select
            label="Overflow"
            data={overflowOptions}
            value={value.tooltip.overflow}
            onChange={getChangeHandler('tooltip.overflow')}
          />
          <TextInput
            label="Ellipsis"
            value={value.tooltip.ellipsis}
            // onChange={(e) => getChangeHandler('tooltip.ellipsis')(e.currentTarget.value)}
            disabled
          />
        </Group>
      </Stack>
    </Stack>
  );
});
