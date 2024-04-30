import { Checkbox, Divider, Group, NumberInput, Select, Stack, Text, TextInput } from '@mantine/core';
import { Control, Controller, UseFormWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { MantineColorSelector } from '~/components/panel/settings/common/mantine-color';
import { LineTypeSelector } from '~/components/plugins/common-echarts-fields/line-type';
import { OrientationSelector } from '~/components/plugins/common-echarts-fields/orientation';
import { IHorizontalBarChartConf } from '../../type';

interface IReferenceLineField {
  control: Control<IHorizontalBarChartConf, $TSFixMe>;
  index: number;
  watch: UseFormWatch<IHorizontalBarChartConf>;
  variableOptions: { label: string; value: string }[];
  xAxisOptions: {
    label: string;
    value: string;
  }[];
}

export function ReferenceLineField({ control, index, watch, variableOptions, xAxisOptions }: IReferenceLineField) {
  const { t } = useTranslation();
  const orientation = watch(`reference_lines.${index}.orientation`);
  return (
    <Stack my={0} p={0} pt={10} sx={{ position: 'relative' }}>
      <Group grow noWrap>
        <Controller
          name={`reference_lines.${index}.name`}
          control={control}
          render={({ field }) => (
            <TextInput
              label={t('common.name')}
              placeholder={t('chart.reference_line.name_placeholder')}
              required
              sx={{ flex: 1 }}
              {...field}
            />
          )}
        />
        <Controller
          name={`reference_lines.${index}.variable_key`}
          control={control}
          render={({ field }) => (
            // @ts-expect-error type of onChange
            <Select label={t('common.data_field')} required data={variableOptions} sx={{ flex: 1 }} {...field} />
          )}
        />
      </Group>
      <Controller
        name={`reference_lines.${index}.template`}
        control={control}
        render={({ field }) => (
          <TextInput
            label={t('chart.content_template.label')}
            placeholder={t('chart.content_template.hint')}
            sx={{ flex: 1 }}
            {...field}
          />
        )}
      />
      <Group grow>
        <Stack>
          <Controller
            name={`reference_lines.${index}.orientation`}
            control={control}
            render={({ field }) => <OrientationSelector sx={{ flex: 1 }} {...field} />}
          />
          {orientation === 'vertical' && (
            <Text mt={-10} color="dimmed" size={12}>
              {t('chart.reference_line.orientation.vertical_hint')}
            </Text>
          )}
        </Stack>
        {orientation === 'horizontal' && (
          <Controller
            name={`reference_lines.${index}.xAxisIndex`}
            control={control}
            render={({ field }) => (
              // @ts-expect-error type of onChange
              <Select
                label={t('chart.x_axis.label')}
                data={xAxisOptions}
                disabled={xAxisOptions.length === 0}
                sx={{ flex: 1 }}
                {...field}
              />
            )}
          />
        )}
      </Group>
      <Divider mb={-10} mt={10} variant="dashed" label={t('chart.style.label')} labelPosition="center" />
      <Group grow>
        <Controller
          name={`reference_lines.${index}.lineStyle.type`}
          control={control}
          render={({ field }) => <LineTypeSelector sx={{ flexGrow: 1 }} {...field} />}
        />
        <Controller
          name={`reference_lines.${index}.lineStyle.width`}
          control={control}
          render={({ field }) => (
            // @ts-expect-error type of onChange
            <NumberInput label={t('chart.series.line.line_width')} min={1} max={10} sx={{ flexGrow: 1 }} {...field} />
          )}
        />
      </Group>
      <Stack spacing={4}>
        <Text size="sm">{t('chart.color.label')}</Text>
        <Controller
          name={`reference_lines.${index}.lineStyle.color`}
          control={control}
          render={({ field }) => <MantineColorSelector {...field} />}
        />
      </Stack>
      <Divider mb={-10} mt={10} variant="dashed" label={t('chart.behavior.label')} labelPosition="center" />
      <Controller
        name={`reference_lines.${index}.show_in_legend`}
        control={control}
        render={({ field }) => (
          <Checkbox
            label={t('chart.legend.show_in_legend')}
            checked={field.value}
            onChange={(event) => field.onChange(event.currentTarget.checked)}
          />
        )}
      />
    </Stack>
  );
}
