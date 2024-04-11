import { Divider, Group, Stack, TextInput } from '@mantine/core';
import { Control, Controller, UseFormWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { DataFieldSelector } from '~/components/panel/settings/common/data-field-selector';
import { LabelOverflowField } from '~/components/plugins/common-echarts-fields/axis-label-overflow';
import { AxisLabelRotateInput } from '~/components/plugins/common-echarts-fields/axis-label-rotate';
import { IScatterChartConf } from '../../type';
import { XAxisLabelFormatterField } from '~/components/plugins/common-echarts-fields/x-axis-label-formatter';

interface IXAxisField {
  control: Control<IScatterChartConf, $TSFixMe>;
  watch: UseFormWatch<IScatterChartConf>;
}
export function XAxisField({ control, watch }: IXAxisField) {
  const { t } = useTranslation();
  watch(['x_axis']);
  return (
    <Stack>
      <Group grow noWrap>
        <Controller
          name="x_axis.data_key"
          control={control}
          render={({ field }) => (
            <DataFieldSelector label={t('common.data_field')} required sx={{ flex: 1 }} {...field} />
          )}
        />
        <Controller
          name="x_axis.name"
          control={control}
          render={({ field }) => <TextInput label={t('common.name')} sx={{ flex: 1 }} {...field} />}
        />
      </Group>
      <Divider mb={-15} label={t('chart.axis.tick_label')} labelPosition="center" />
      <Group grow noWrap>
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
      <Controller
        name="x_axis.axisLabel.overflow"
        control={control}
        render={({ field }) => <LabelOverflowField {...field} />}
      />
    </Stack>
  );
}
