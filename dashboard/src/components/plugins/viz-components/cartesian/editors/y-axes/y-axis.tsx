import { Checkbox, Divider, Group, Stack, TextInput } from '@mantine/core';
import { Control, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { NumbroFormatSelector } from '~/components/panel/settings/common/numbro-format-selector';
import { NameTextAlignSelector } from '~/components/plugins/common-echarts-fields/name-text-align';
import { YAxisPositionSelector } from '~/components/plugins/common-echarts-fields/y-axis-position';
import { ICartesianChartConf } from '../../type';

interface IYAxisField {
  control: Control<ICartesianChartConf, $TSFixMe>;
  index: number;
}

export function YAxisField({ control, index }: IYAxisField) {
  const { t } = useTranslation();
  return (
    <Stack my={0} p="0" sx={{ position: 'relative' }}>
      <Divider mb={-15} mt={15} variant="dashed" label={t('common.name')} labelPosition="center" />
      <Group grow noWrap>
        <Controller
          name={`y_axes.${index}.name`}
          control={control}
          render={({ field }) => (
            <TextInput label={t('chart.y_axis.y_axis_name')} required sx={{ flex: 1 }} {...field} />
          )}
        />
        <Controller
          name={`y_axes.${index}.nameAlignment`}
          control={control}
          render={({ field }) => <NameTextAlignSelector sx={{ flex: 1 }} {...field} />}
        />
      </Group>
      <Divider mb={-15} variant="dashed" label={t('chart.y_axis.layout')} labelPosition="center" />
      <Group grow noWrap>
        <Controller
          name={`y_axes.${index}.position`}
          control={control}
          render={({ field }) => <YAxisPositionSelector sx={{ flex: 1 }} {...field} />}
        />
      </Group>
      <Stack>
        <Divider mb={-15} variant="dashed" label={t('chart.y_axis.label_format')} labelPosition="center" />
        <Controller
          name={`y_axes.${index}.label_formatter`}
          control={control}
          render={({ field }) => <NumbroFormatSelector {...field} />}
        />
      </Stack>

      <Stack>
        <Divider mb={-15} variant="dashed" label={t('chart.y_axis.value_range')} labelPosition="center" />
        <Group grow>
          <Controller
            name={`y_axes.${index}.min`}
            control={control}
            render={({ field }) => <TextInput label={t('chart.y_axis.value_min')} {...field} />}
          />
          <Controller
            name={`y_axes.${index}.max`}
            control={control}
            render={({ field }) => <TextInput label={t('chart.y_axis.value_max')} {...field} />}
          />
        </Group>
      </Stack>

      <Divider mb={-10} mt={10} variant="dashed" label={t('chart.y_axis.behavior')} labelPosition="center" />
      <Controller
        name={`y_axes.${index}.show`}
        control={control}
        render={({ field }) => (
          <Checkbox
            label={t('chart.y_axis.visible')}
            checked={field.value}
            onChange={(event) => field.onChange(event.currentTarget.checked)}
          />
        )}
      />
    </Stack>
  );
}
