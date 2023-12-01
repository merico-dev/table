/**
 * NOTE: this file is almost a duplicate of stats/panel/variables.tsx
 * FIXME: remove this when variables' fields are defined in utils/template
 */
import { Stack } from '@mantine/core';
import { Control, Controller, UseFormWatch } from 'react-hook-form';
import { TemplateInput } from '~/utils';
import { ICartesianChartConf } from '../../type';

interface IVariablesField {
  control: Control<ICartesianChartConf, $TSFixMe>;
  watch: UseFormWatch<ICartesianChartConf>;
}

export function StatsField({ control, watch }: IVariablesField) {
  watch('stats');
  return (
    <Stack>
      <Stack spacing={0}>
        <Controller
          name="stats.templates.top"
          control={control}
          render={({ field }) => (
            <TemplateInput label="Template for stats above the chart" py="md" sx={{ flexGrow: 1 }} {...field} />
          )}
        />
        <Controller
          name="stats.templates.bottom"
          control={control}
          render={({ field }) => (
            <TemplateInput label="Template for stats under the chart" py="md" sx={{ flexGrow: 1 }} {...field} />
          )}
        />
      </Stack>
    </Stack>
  );
}
