import { Button, Checkbox, Divider, Group, NumberInput, Select, Stack, Text, TextInput } from '@mantine/core';
import { Control, Controller, UseFieldArrayRemove, UseFormWatch } from 'react-hook-form';
import { Trash } from 'tabler-icons-react';
import { MantineColorSelector } from '~/components/panel/settings/common/mantine-color';
import { ICartesianChartConf } from '../../type';
import { useTranslation } from 'react-i18next';

const lineTypeOptions = [
  { label: 'solid', value: 'solid' },
  { label: 'dashed', value: 'dashed' },
  { label: 'dotted', value: 'dotted' },
];

const orientationOptions = [
  { label: 'Horizontal', value: 'horizontal' },
  { label: 'Vertical', value: 'vertical' },
];

interface IReferenceLineField {
  control: Control<ICartesianChartConf, $TSFixMe>;
  index: number;
  watch: UseFormWatch<ICartesianChartConf>;
  remove: UseFieldArrayRemove;
  variableOptions: { label: string; value: string }[];
  yAxisOptions: {
    label: string;
    value: string;
  }[];
}

export function ReferenceLineField({
  control,
  index,
  remove,
  watch,
  variableOptions,
  yAxisOptions,
}: IReferenceLineField) {
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
            render={({ field }) => (
              // @ts-expect-error type of onChange
              <Select
                label={t('chart.reference_line.orientation.label')}
                data={orientationOptions}
                required
                sx={{ flex: 1 }}
                {...field}
              />
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
          render={({ field }) => (
            // @ts-expect-error type of onChange
            <Select label={t('chart.series.line.type.label')} data={lineTypeOptions} sx={{ flexGrow: 1 }} {...field} />
          )}
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
      <Button
        leftIcon={<Trash size={16} />}
        color="red"
        variant="light"
        onClick={() => remove(index)}
        sx={{ top: 15, right: 5 }}
      >
        {t('chart.reference_line.delete')}
      </Button>
    </Stack>
  );
}
