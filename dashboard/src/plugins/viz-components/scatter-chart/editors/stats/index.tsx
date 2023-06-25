import { Stack } from '@mantine/core';
import { Control, Controller, UseFormWatch } from 'react-hook-form';
import { TemplateInput } from '~/utils/template';
import { IScatterChartConf } from '../../type';

interface IVariablesField {
  control: Control<IScatterChartConf, $TSFixMe>;
  watch: UseFormWatch<IScatterChartConf>;
  data: TPanelData;
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
