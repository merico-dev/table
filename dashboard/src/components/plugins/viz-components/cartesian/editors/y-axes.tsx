import { Button, Checkbox, Divider, Group, Stack, Tabs, TextInput } from '@mantine/core';
import { Control, Controller, UseFieldArrayRemove, UseFormWatch, useFieldArray } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Plus, Trash } from 'tabler-icons-react';
import { NumbroFormatSelector } from '~/components/panel/settings/common/numbro-format-selector';
import { NameTextAlignSelector } from '~/components/plugins/common-echarts-fields/name-text-align';
import { YAxisPositionSelector } from '~/components/plugins/common-echarts-fields/y-axis-position';
import { defaultNumberFormat } from '~/utils';
import { ICartesianChartConf } from '../type';

interface IYAxisField {
  control: Control<ICartesianChartConf, $TSFixMe>;
  index: number;
  remove: UseFieldArrayRemove;
}

function YAxisField({ control, index, remove }: IYAxisField) {
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

      <Button
        mt={20}
        leftIcon={<Trash size={16} />}
        color="red"
        variant="light"
        onClick={() => remove(index)}
        disabled={index === 0}
      >
        {t('chart.y_axis.delete')}
      </Button>
    </Stack>
  );
}

interface IYAxesField {
  control: Control<ICartesianChartConf, $TSFixMe>;
  watch: UseFormWatch<ICartesianChartConf>;
}
export function YAxesField({ control, watch }: IYAxesField) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'y_axes',
  });

  const watchFieldArray = watch('y_axes');
  const controlledFields = fields.map((field, index) => {
    return {
      ...field,
      ...watchFieldArray[index],
    };
  });

  const addYAxis = () =>
    append({
      name: '',
      position: 'left',
      nameAlignment: 'left',
      label_formatter: defaultNumberFormat,
      min: '',
      max: '',
      show: true,
    });

  return (
    <Tabs
      defaultValue="0"
      styles={{
        tab: {
          paddingTop: '0px',
          paddingBottom: '0px',
        },
        panel: {
          padding: '0px',
        },
      }}
    >
      <Tabs.List>
        {controlledFields.map((field, index) => (
          <Tabs.Tab key={field.id} value={index.toString()}>
            {index + 1}
            {/* {field.name.trim() ? field.name : index + 1} */}
          </Tabs.Tab>
        ))}
        <Tabs.Tab onClick={addYAxis} value="add">
          <Plus size={18} color="#228be6" />
        </Tabs.Tab>
      </Tabs.List>
      {controlledFields.map((field, index) => (
        <Tabs.Panel key={field.id} value={index.toString()}>
          <YAxisField control={control} index={index} remove={remove} />
        </Tabs.Panel>
      ))}
    </Tabs>
  );
}
