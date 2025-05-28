import { Checkbox } from '@mantine/core';

import { Controller } from 'react-hook-form';

import { UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { IVizDashboardStateConf } from '../type';
import { Stack } from '@mantine/core';
import { DashboardStateVariableSelector } from './dashboard-state-variable-selector';

export const Fields = ({ form }: { form: UseFormReturn<IVizDashboardStateConf> }) => {
  const { t } = useTranslation();
  const all = form.watch('all');
  return (
    <Stack gap="xs" p="xs">
      <Controller
        name="all"
        control={form.control}
        render={({ field }) => (
          <Checkbox
            size="xs"
            label={t('viz.vizDashboardState.show_all')}
            checked={field.value}
            onChange={(e) => field.onChange(e.currentTarget.checked)}
          />
        )}
      />
      <Controller
        name="keys"
        control={form.control}
        render={({ field }) => <DashboardStateVariableSelector disabled={all} {...field} />}
      />
    </Stack>
  );
};
