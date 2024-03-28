import { Divider, Group, NumberInput, Select, Stack, TextInput } from '@mantine/core';
import _ from 'lodash';
import { forwardRef } from 'react';
import { IEchartsOverflow } from './types';
import { useTranslation } from 'react-i18next';

const overflowOptions = [
  { label: 'Truncate', value: 'truncate' },
  { label: 'Break Line', value: 'break' },
  { label: 'Break Word', value: 'breakAll' },
];

interface IOverflowField {
  sectionTitle?: string;
  value: IEchartsOverflow;
  onChange: (v: IEchartsOverflow) => void;
}

export const OverflowField = forwardRef(({ sectionTitle, value, onChange }: IOverflowField, ref: any) => {
  const { t } = useTranslation();
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
        <NumberInput
          label={t('chart.axis.overflow.max_width')}
          hideControls
          value={value.width}
          onChange={getChangeHandler('width')}
        />
        <Select
          label={t('chart.axis.overflow.label')}
          data={overflowOptions}
          value={value.overflow}
          onChange={getChangeHandler('overflow')}
        />
        <TextInput
          label={t('chart.axis.overflow.ellipsis')}
          value={value.ellipsis}
          // onChange={(e) => getChangeHandler('ellipsis')(e.currentTarget.value)}
          disabled
        />
      </Group>
    </Stack>
  );
});
