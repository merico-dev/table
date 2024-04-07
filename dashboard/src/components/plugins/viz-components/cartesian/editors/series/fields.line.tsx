import { Box, Divider, Group, NumberInput, Select, Stack, Switch } from '@mantine/core';
import { Control, Controller } from 'react-hook-form';
import { ICartesianChartConf, ICartesianChartSeriesItem } from '../../type';
import { ScatterSizeSelect } from '../scatter-size-select';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { LineTypeSelector } from '~/components/plugins/common-echarts-fields/line-type';

interface ILineFields {
  control: Control<ICartesianChartConf, $TSFixMe>;
  seriesItem: ICartesianChartSeriesItem;
  index: number;
}

export function LineFields({ control, index, seriesItem }: ILineFields) {
  const { t, i18n } = useTranslation();
  const showSymbol = seriesItem.showSymbol;

  const stepOptions = useMemo(
    () => [
      { label: t('chart.series.line.step.off'), value: 'false' },
      { label: t('chart.series.line.step.start'), value: 'start' },
      { label: t('chart.series.line.step.middle'), value: 'middle' },
      { label: t('chart.series.line.step.end'), value: 'end' },
    ],
    [i18n.language],
  );

  return (
    <>
      <Divider mb={-15} variant="dashed" label={t('chart.series.line.line_settings')} labelPosition="center" />
      <Group grow>
        <Controller
          name={`series.${index}.lineStyle.type`}
          control={control}
          render={({ field }) => (
            <LineTypeSelector label={t('chart.series.line.type.label')} sx={{ flexGrow: 1 }} {...field} />
          )}
        />
        <Controller
          name={`series.${index}.lineStyle.width`}
          control={control}
          render={({ field }) => (
            // @ts-expect-error type of onChange
            <NumberInput label={t('chart.series.line.line_width')} min={1} max={10} sx={{ flexGrow: 1 }} {...field} />
          )}
        />
      </Group>
      <Group grow align="center">
        <Controller
          name={`series.${index}.step`}
          control={control}
          render={({ field }) => (
            <Select
              label={t('chart.series.line.step.label')}
              data={stepOptions}
              sx={{ flexGrow: 1, maxWidth: '48%' }}
              {...field}
              value={String(field.value)}
              onChange={(v: 'false' | 'start' | 'middle' | 'end') => {
                const step = v === 'false' ? false : v;
                field.onChange(step);
              }}
            />
          )}
        />
        <Stack>
          <Controller
            name={`series.${index}.smooth`}
            control={control}
            render={({ field }) => (
              <Box sx={{ flexGrow: 1 }}>
                <Switch
                  label={t('chart.series.line.smooth_line')}
                  checked={field.value}
                  onChange={(event) => field.onChange(event.currentTarget.checked)}
                />
              </Box>
            )}
          />
          <Controller
            name={`series.${index}.display_name_on_line`}
            control={control}
            render={({ field }) => (
              <Box sx={{ flexGrow: 1 }}>
                <Switch
                  label={t('chart.series.line.show_name_on_line')}
                  checked={field.value ?? false}
                  onChange={(event) => field.onChange(event.currentTarget.checked)}
                />
              </Box>
            )}
          />
        </Stack>
      </Group>
      <Stack>
        <Controller
          name={`series.${index}.showSymbol`}
          control={control}
          render={({ field }) => (
            <Box mt={10} mb={-10} sx={{ flexGrow: 1 }}>
              <Switch
                label={t('chart.series.line.show_symbol_on_line')}
                checked={field.value}
                onChange={(event) => field.onChange(event.currentTarget.checked)}
              />
            </Box>
          )}
        />
        {showSymbol && (
          <Controller
            name={`series.${index}.symbolSize`}
            control={control}
            render={({ field }) => <ScatterSizeSelect label={t('chart.symbol_size.label')} {...field} />}
          />
        )}
      </Stack>
    </>
  );
}
