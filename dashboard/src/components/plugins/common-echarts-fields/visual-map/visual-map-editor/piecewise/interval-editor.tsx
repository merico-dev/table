import { Button, Group, Popover, Select, Text, TextInput } from '@mantine/core';
import { Control, Controller, UseFormReturn } from 'react-hook-form';
import { VisualMapPartialForm } from '../types';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

const symbols = {
  lower: [
    { label: '<', value: 'gt' },
    { label: '≤', value: 'gte' },
  ],
  upper: [
    { label: '>', value: 'lt' },
    { label: '≥', value: 'lte' },
  ],
};

const symbolToBracket = {
  gt: '(',
  gte: '[',
  lt: ')',
  lte: ']',
};
const toIntervalValue = (v: string, extremum: '') => {
  if (v === '') {
    return extremum;
  }
  if (Number.isNaN(Number(v))) {
    return 'INVALID VALUE';
  }
  return v;
};

type Props = {
  form: UseFormReturn<VisualMapPartialForm>;
  index: number;
};
export const IntervalEditor = ({ form, index }: Props) => {
  const { t } = useTranslation();

  const { control, watch } = form;
  const piece = watch(`visualMap.pieces.${index}`);
  const { lower, upper } = piece;

  const intervalPreview = [
    symbolToBracket[lower.symbol],
    toIntervalValue(lower.value, t('chart.visual_map.min_value')),
    ',',
    toIntervalValue(upper.value, t('chart.visual_map.max_value')),
    symbolToBracket[upper.symbol],
  ].join('');

  const [opened, setOpened] = useState(false);

  return (
    <Group noWrap>
      <Popover
        width={400}
        position="bottom"
        withArrow
        shadow="md"
        opened={opened}
        onChange={setOpened}
        withinPortal
        zIndex={340}
      >
        <Popover.Target>
          <Button
            variant="subtle"
            compact
            px={0}
            onClick={() => setOpened((o) => !o)}
            sx={{ fontFamily: 'monospace', fontWeight: 'normal' }}
          >
            {intervalPreview}
          </Button>
        </Popover.Target>
        <Popover.Dropdown>
          <Group noWrap spacing={8}>
            <Controller
              name={`visualMap.pieces.${index}.lower.value`}
              control={control}
              render={({ field }) => (
                <TextInput
                  {...field}
                  placeholder={t('chart.visual_map.min_value')}
                  size="xs"
                  onChange={(e) => field.onChange(e.currentTarget.value)}
                  error={field.value !== '' && Number.isNaN(Number(field.value))}
                />
              )}
            />
            <Controller
              name={`visualMap.pieces.${index}.lower.symbol`}
              control={control}
              render={({ field }) => (
                <Select size="xs" data={symbols.lower} {...field} onChange={(v: 'gt' | 'gte') => field.onChange(v)} />
              )}
            />
            <Text color="dimmed" size="sm" sx={{ userSelect: 'none', cursor: 'default' }}>
              {t('common.value').toLowerCase()}
            </Text>
            <Controller
              name={`visualMap.pieces.${index}.upper.symbol`}
              control={control}
              render={({ field }) => (
                <Select size="xs" data={symbols.upper} {...field} onChange={(v: 'lt' | 'lte') => field.onChange(v)} />
              )}
            />
            <Controller
              name={`visualMap.pieces.${index}.upper.value`}
              control={control}
              render={({ field }) => (
                <TextInput
                  {...field}
                  size="xs"
                  placeholder={t('chart.visual_map.max_value')}
                  onChange={(e) => field.onChange(e.currentTarget.value)}
                  error={field.value !== '' && Number.isNaN(Number(field.value))}
                />
              )}
            />
          </Group>
        </Popover.Dropdown>
      </Popover>
    </Group>
  );
};
