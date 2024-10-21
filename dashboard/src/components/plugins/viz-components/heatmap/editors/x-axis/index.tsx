import { Divider, Group, Stack, TextInput } from '@mantine/core';
import { Control, Controller, UseFormWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { DataFieldSelector } from '~/components/panel/settings/common/data-field-selector';
import { AxisLabelRotateInput } from '~/components/plugins/common-echarts-fields/axis-label-rotate';
import { LabelOverflowField } from '../../../../common-echarts-fields/axis-label-overflow';
import { IHeatmapConf } from '../../type';
import { XAxisLabelFormatterField } from '~/components/plugins/common-echarts-fields/x-axis-label-formatter';

interface IXAxisField {
  control: Control<IHeatmapConf, $TSFixMe>;
  watch: UseFormWatch<IHeatmapConf>;
}
export function XAxisField({ control, watch }: IXAxisField) {
  const { t } = useTranslation();
  watch(['x_axis']);
  return (
    <Stack>
      <Group grow wrap="nowrap">
        <Controller
          name="x_axis.data_key"
          control={control}
          render={({ field }) => <DataFieldSelector label={t('common.data_field')} sx={{ flex: 1 }} {...field} />}
        />
        <Controller
          name="x_axis.name"
          control={control}
          render={({ field }) => <TextInput label={t('common.name')} sx={{ flex: 1 }} {...field} />}
        />
      </Group>
      <Divider mb={-15} variant="dashed" label={t('chart.axis.tick_label')} labelPosition="center" />
      <Controller
        name="x_axis.axisLabel.overflow"
        control={control}
        render={({ field }) => <LabelOverflowField {...field} />}
      />
      <Group grow wrap="nowrap">
        <Controller
          name="x_axis.axisLabel.rotate"
          control={control}
          render={({ field }) => <AxisLabelRotateInput sx={{ width: '48%' }} {...field} />}
        />
        <Controller
          name="x_axis.axisLabel.formatter"
          control={control}
          render={({ field }) => <XAxisLabelFormatterField {...field} />}
        />
      </Group>
    </Stack>
  );
}
