import { Checkbox, Divider, Group, NumberInput, Select, SimpleGrid, Stack, Text, TextInput } from '@mantine/core';
import { Control, Controller, UseFormWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { LineTypeSelector } from '~/components/plugins/common-echarts-fields/line-type';
import { OrientationSelector } from '~/components/plugins/common-echarts-fields/orientation';
import { ColorPickerPopoverForViz } from '~/components/widgets';
import { ICartesianChartConf } from '../../type';

interface IReferenceLineField {
  control: Control<ICartesianChartConf, $TSFixMe>;
  index: number;
  watch: UseFormWatch<ICartesianChartConf>;
  variableOptions: { label: string; value: string }[];
  yAxisOptions: {
    label: string;
    value: string;
  }[];
}

export function ReferenceLineField({ control, index, watch, variableOptions, yAxisOptions }: IReferenceLineField) {
  const { t } = useTranslation();
  const orientation = watch(`reference_lines.${index}.orientation`);
  return (
    <Stack my={0} p={0} sx={{ position: 'relative' }}>
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
            render={({ field }) => (
              <OrientationSelector label={t('chart.orientation.label')} sx={{ flex: 1 }} {...field} />
            )}
          />
          {orientation === 'vertical' && (
            <Text mt={-10} color="dimmed" size={12}>
              {t('chart.reference_line.orientation.vertical_hint')}
            </Text>
          )}
        </Stack>
        {orientation === 'horizontal' && (
          <Controller
            name={`reference_lines.${index}.yAxisIndex`}
            control={control}
            render={({ field: { value, onChange, ...rest } }) => (
              <Select
                label={t('chart.y_axis.label')}
                data={yAxisOptions}
                disabled={yAxisOptions.length === 0}
                {...rest}
                value={value?.toString() ?? ''}
                onChange={(value: string | null) => {
                  if (!value) {
                    onChange(0);
                    return;
                  }
                  onChange(Number(value));
                }}
                sx={{ flex: 1 }}
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
            <NumberInput label={t('chart.series.line.line_width')} min={1} max={10} sx={{ flexGrow: 1 }} {...field} />
          )}
        />
      </Group>
      <SimpleGrid cols={2}>
        <Controller
          name={`reference_lines.${index}.lineStyle.color`}
          control={control}
          render={({ field }) => <ColorPickerPopoverForViz label={t('chart.color.label')} {...field} />}
        />
      </SimpleGrid>
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
