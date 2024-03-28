import { Button, Divider, Group, Stack, TextInput } from '@mantine/core';
import { Control, Controller } from 'react-hook-form';
import { Trash } from 'tabler-icons-react';
import { DataFieldSelector } from '~/components/panel/settings/common/data-field-selector';
import { IBoxplotChartConf } from '../../type';
import { useTranslation } from 'react-i18next';

interface ITooltipMetricField {
  control: Control<IBoxplotChartConf, $TSFixMe>;
  index: number;
  remove: (index: number) => void;
}

export const TooltipMetricField = ({ control, index, remove }: ITooltipMetricField) => {
  const { t } = useTranslation();
  return (
    <Stack>
      <Group grow noWrap>
        <Controller
          name={`tooltip.metrics.${index}.name`}
          control={control}
          render={({ field }) => <TextInput label={t('common.name')} required sx={{ flex: 1 }} {...field} />}
        />
        <Controller
          name={`tooltip.metrics.${index}.data_key`}
          control={control}
          render={({ field }) => (
            <DataFieldSelector label={t('chart.data_field')} required sx={{ flex: 1 }} {...field} />
          )}
        />
      </Group>
      <Divider mb={-10} mt={10} variant="dashed" />
      <Button
        leftIcon={<Trash size={16} />}
        color="red"
        variant="light"
        onClick={() => remove(index)}
        sx={{ top: 15, right: 5 }}
      >
        {t('chart.tooltip.additional_metrics.delete')}
      </Button>
    </Stack>
  );
};
