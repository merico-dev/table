import { Divider, Group, NumberInput, Select, Stack, TextInput } from '@mantine/core';
import _ from 'lodash';
import { forwardRef, useMemo } from 'react';
import { IEchartsOverflow } from './types';
import { useTranslation } from 'react-i18next';

interface IOverflowField {
  sectionTitle?: string;
  value: IEchartsOverflow;
  onChange: (v: IEchartsOverflow) => void;
}

export const OverflowField = forwardRef(({ sectionTitle, value, onChange }: IOverflowField, ref: any) => {
  const { t, i18n } = useTranslation();
  const getChangeHandler = (path: string) => (v: any) => {
    const newV = _.cloneDeep(value);
    _.set(newV, path, v);
    onChange(newV);
  };

  const overflowOptions = useMemo(
    () => [
      { label: t('chart.axis.overflow.truncate'), value: 'truncate' },
      { label: t('chart.axis.overflow.break_line'), value: 'break' },
      { label: t('chart.axis.overflow.break_word'), value: 'breakAll' },
    ],
    [i18n.language],
  );
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
