import { Checkbox, Divider, Group, Stack, TextInput } from '@mantine/core';
import { Control, Controller, UseFormWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { DataFieldSelector } from '~/components/panel/settings/common/data-field-selector';
import { AxisLabelRotateInput } from '~/components/plugins/common-echarts-fields/axis-label-rotate';
import { NameTextAlignSelector } from '~/components/plugins/common-echarts-fields/name-text-align';
import { XAxisLabelFormatterField } from '~/components/plugins/common-echarts-fields/x-axis-label-formatter';
import { LabelOverflowField } from '../../../../common-echarts-fields/axis-label-overflow';
import { IHeatmapConf } from '../../type';

interface IYAxisField {
  watch: UseFormWatch<IHeatmapConf>;
  control: Control<IHeatmapConf, $TSFixMe>;
}

export function YAxisField({ control, watch }: IYAxisField) {
  const { t } = useTranslation();
  watch(['y_axis']);
  return (
    <Stack my={0} p="0" sx={{ position: 'relative' }}>
      <Group grow wrap="nowrap">
        <Controller
          name="y_axis.data_key"
          control={control}
          render={({ field }) => <DataFieldSelector label={t('common.data_field')} sx={{ flex: 1 }} {...field} />}
        />
        <Controller
          name="y_axis.name"
          control={control}
          render={({ field }) => <TextInput label={t('common.name')} sx={{ flex: 1 }} {...field} />}
        />
      </Group>
      <Group grow wrap="nowrap">
        <Controller
          name="y_axis.nameAlignment"
          control={control}
          render={({ field }) => <NameTextAlignSelector sx={{ flex: 1 }} {...field} />}
        />
      </Group>
      <Controller
        name="y_axis.inverse"
        control={control}
        render={({ field }) => (
          <Checkbox
            size="sm"
            checked={field.value}
            onChange={(event) => field.onChange(event.currentTarget.checked)}
            label={t('chart.y_axis.inverse')}
            styles={{
              root: {
                transform: 'translateY(6px)',
              },
              label: {
                cursor: 'pointer',
                userSelect: 'none',
              },
              input: {
                cursor: 'pointer',
              },
            }}
          />
        )}
      />
      <Divider mb={-15} variant="dashed" label={t('chart.axis.tick_label')} labelPosition="center" />
      <Controller
        name="y_axis.axisLabel.overflow"
        control={control}
        render={({ field }) => <LabelOverflowField {...field} />}
      />
      <Group grow wrap="nowrap">
        <Controller
          name="y_axis.axisLabel.rotate"
          control={control}
          render={({ field }) => <AxisLabelRotateInput sx={{ width: '48%' }} {...field} />}
        />
        <Controller
          name="y_axis.axisLabel.formatter"
          control={control}
          render={({ field }) => <XAxisLabelFormatterField {...field} />}
        />
      </Group>
    </Stack>
  );
}
