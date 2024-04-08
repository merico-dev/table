import { Group, Select, TextInput } from '@mantine/core';
import { Control, Controller } from 'react-hook-form';
import { IHorizontalBarChartConf, IHorizontalBarChartSeriesItem } from '../../type';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';

interface IBarFields {
  control: Control<IHorizontalBarChartConf, $TSFixMe>;
  index: number;
  seriesItem: IHorizontalBarChartSeriesItem;
}

export function BarFields({ control, index, seriesItem }: IBarFields) {
  const { t, i18n } = useTranslation();
  const usingBarWidth = !!seriesItem.barWidth.trim();

  const barGapOptions = useMemo(
    () => [
      {
        label: t('chart.series.bar.bar_gap.no_gap'),
        value: '0%',
      },
      {
        label: t('chart.series.bar.bar_gap.overlap'),
        value: '-100%',
      },
    ],
    [i18n.language],
  );
  return (
    <>
      <Group grow noWrap>
        <Controller
          name={`series.${index}.stack`}
          control={control}
          render={({ field }) => (
            <TextInput
              label={t('chart.series.bar.stack')}
              placeholder={t('chart.series.bar.stack_hint')}
              sx={{ flexGrow: 1 }}
              {...field}
            />
          )}
        />
        <Controller
          name={`series.${index}.barGap`}
          control={control}
          render={({ field }) => (
            // @ts-expect-error type of onChange
            <Select label={t('chart.series.bar.bar_gap.label')} data={barGapOptions} sx={{ flexGrow: 1 }} {...field} />
          )}
        />
      </Group>
      <Group grow noWrap>
        <Controller
          name={`series.${index}.barMinWidth`}
          control={control}
          render={({ field }) => (
            <TextInput
              label={t('chart.series.bar.bar_width.min')}
              disabled={usingBarWidth}
              sx={{ flexGrow: 1 }}
              {...field}
            />
          )}
        />
        <Controller
          name={`series.${index}.barWidth`}
          control={control}
          render={({ field }) => (
            <TextInput label={t('chart.series.bar.bar_width.exact')} sx={{ flexGrow: 1 }} {...field} />
          )}
        />
        <Controller
          name={`series.${index}.barMaxWidth`}
          control={control}
          render={({ field }) => (
            <TextInput
              label={t('chart.series.bar.bar_width.max')}
              disabled={usingBarWidth}
              sx={{ flexGrow: 1 }}
              {...field}
            />
          )}
        />
      </Group>
    </>
  );
}
