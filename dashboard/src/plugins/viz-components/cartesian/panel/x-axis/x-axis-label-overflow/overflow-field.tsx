import { Divider, Group, NumberInput, Select, Stack, TextInput } from '@mantine/core';
import _ from 'lodash';
import { forwardRef } from 'react';
import { IOverflow } from './types';

const overflowOptions = [
  { label: 'Truncate', value: 'truncate' },
  { label: 'Break Line', value: 'break' },
  { label: 'Break Word', value: 'breakAll' },
];

interface IOverflowField {
  sectionTitle?: string;
  value: IOverflow;
  onChange: (v: IOverflow) => void;
}

export const OverflowField = forwardRef(({ sectionTitle, value, onChange }: IOverflowField, ref: any) => {
  const getChangeHandler = (path: string) => (v: any) => {
    const newV = _.cloneDeep(value);
    _.set(newV, path, v);
    onChange(newV);
  };
  return (
    <Stack spacing={0}>
      {sectionTitle && (
        <Divider
          mb={-5}
          mt={5}
          variant="dotted"
          label={sectionTitle}
          labelPosition="right"
          labelProps={{ color: 'dimmed' }}
        />
      )}
      <Group grow noWrap>
        <NumberInput label="Max Width" hideControls value={value.width} onChange={getChangeHandler('width')} />
        <Select
          label="Overflow"
          data={overflowOptions}
          value={value.overflow}
          onChange={getChangeHandler('overflow')}
        />
        <TextInput
          label="Ellipsis"
          value={value.ellipsis}
          // onChange={(e) => getChangeHandler('ellipsis')(e.currentTarget.value)}
          disabled
        />
      </Group>
    </Stack>
  );
});
