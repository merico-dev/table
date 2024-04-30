import { ActionIcon, Button, Divider, Group, Select, Stack, TextInput } from '@mantine/core';
import { Control, Controller, UseFieldArrayRemove } from 'react-hook-form';
import { Trash } from 'tabler-icons-react';
import { ICartesianChartConf } from '../../type';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';

interface IReferenceAreaField {
  control: Control<ICartesianChartConf, $TSFixMe>;
  index: number;
  variableOptions: { label: string; value: string }[];
}

export function ReferenceAreaField({ control, index, variableOptions }: IReferenceAreaField) {
  const { t, i18n } = useTranslation();
  const referenceAreaTypeOptions = useMemo(
    () => [{ label: t('chart.reference_area.type.rectangle'), value: 'rectangle' }],
    [i18n.language],
  );

  const referenceAreaDirectionOptions = useMemo(
    () => [{ label: t('chart.reference_area.direction.horizontal'), value: 'horizontal' }],
    [i18n.language],
  );

  return (
    <Stack my={0} p={0} sx={{ position: 'relative' }}>
      <Group grow noWrap>
        <Controller
          name={`reference_areas.${index}.name`}
          control={control}
          render={({ field }) => (
            <TextInput label={t('chart.reference_area.label')} required sx={{ flex: 1 }} {...field} />
          )}
        />
        <Controller
          name={`reference_areas.${index}.color`}
          control={control}
          render={({ field }) => <TextInput label={t('chart.color.label')} required sx={{ flex: 1 }} {...field} />}
        />
      </Group>
      <Group grow noWrap>
        <Controller
          name={`reference_areas.${index}.type`}
          control={control}
          render={({ field }) => (
            // @ts-expect-error type of onChange
            <Select
              label={t('chart.reference_area.type.label')}
              required
              data={referenceAreaTypeOptions}
              sx={{ flex: 1 }}
              {...field}
            />
          )}
        />
        <Controller
          name={`reference_areas.${index}.direction`}
          control={control}
          render={({ field }) => (
            // @ts-expect-error type of onChange
            <Select
              label={t('chart.reference_area.direction.label')}
              required
              data={referenceAreaDirectionOptions}
              sx={{ flex: 1 }}
              {...field}
            />
          )}
        />
      </Group>
      <Divider variant="dashed" label={t('data.label')} labelPosition="center" />
      <Group grow noWrap>
        <Controller
          name={`reference_areas.${index}.y_keys.upper`}
          control={control}
          render={({ field }) => (
            // @ts-expect-error type of onChange
            <Select
              label={t('chart.reference_area.boundary.upper')}
              required
              data={variableOptions}
              sx={{ flex: 1 }}
              {...field}
            />
          )}
        />
        <Controller
          name={`reference_areas.${index}.y_keys.lower`}
          control={control}
          render={({ field }) => (
            // @ts-expect-error type of onChange
            <Select
              label={t('chart.reference_area.boundary.lower')}
              required
              data={variableOptions}
              sx={{ flex: 1 }}
              {...field}
            />
          )}
        />
      </Group>
    </Stack>
  );
}
