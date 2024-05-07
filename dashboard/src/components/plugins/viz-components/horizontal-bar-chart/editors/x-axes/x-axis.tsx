import { Checkbox, Divider, Group, Stack, TextInput } from '@mantine/core';
import { Control, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { NumbroFormatSelector } from '~/components/panel/settings/common/numbro-format-selector';
import { XAxisPositionSelector } from '~/components/plugins/common-echarts-fields/x-axis-position';
import { IHorizontalBarChartConf } from '../../type';

interface IXAxisField {
  control: Control<IHorizontalBarChartConf, $TSFixMe>;
  index: number;
}

export function XAxisField({ control, index }: IXAxisField) {
  const { t } = useTranslation();
  return (
    <Stack my={10} p="0" sx={{ position: 'relative' }}>
      <Group grow noWrap>
        <Controller
          name={`x_axes.${index}.name`}
          control={control}
          render={({ field }) => <TextInput label={t('common.name')} required sx={{ flex: 1 }} {...field} />}
        />
        <Controller
          name={`x_axes.${index}.position`}
          control={control}
          render={({ field }) => <XAxisPositionSelector sx={{ flex: 1 }} {...field} />}
        />
      </Group>
      <Stack>
        <Divider mb={-15} variant="dashed" label={t('chart.x_axis.label_format')} labelPosition="center" />
        <Controller
          name={`x_axes.${index}.label_formatter`}
          control={control}
          render={({ field }) => <NumbroFormatSelector {...field} />}
        />
      </Stack>

      <Stack>
        <Divider mb={-15} variant="dashed" label={t('chart.x_axis.value_range')} labelPosition="center" />
        <Group grow>
          <Controller
            name={`x_axes.${index}.min`}
            control={control}
            render={({ field }) => <TextInput label={t('chart.x_axis.value_min')} {...field} />}
          />
          <Controller
            name={`x_axes.${index}.max`}
            control={control}
            render={({ field }) => <TextInput label={t('chart.x_axis.value_max')} {...field} />}
          />
        </Group>
      </Stack>
      <Divider mb={-10} mt={10} variant="dashed" label={t('chart.x_axis.behavior')} labelPosition="center" />
      <Controller
        name={`x_axes.${index}.show`}
        control={control}
        render={({ field }) => (
          <Checkbox
            label={t('chart.x_axis.visible')}
            checked={field.value}
            onChange={(event) => field.onChange(event.currentTarget.checked)}
          />
        )}
      />
    </Stack>
  );
}
