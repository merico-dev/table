import { Group, Select, Stack, TextInput } from '@mantine/core';
import { Control, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { IBoxplotChartConf } from '../../type';

interface IReferenceLineField {
  control: Control<IBoxplotChartConf, $TSFixMe>;
  index: number;
  variableOptions: { label: string; value: string }[];
}

export function ReferenceLineField({ control, index, variableOptions }: IReferenceLineField) {
  const { t } = useTranslation();
  return (
    <Stack my={0} p="md" pr={40} sx={{ border: '1px solid #eee', position: 'relative' }}>
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
            <Select label={t('common.value')} required data={variableOptions} sx={{ flex: 1 }} {...field} />
          )}
        />
      </Group>
      <Controller
        name={`reference_lines.${index}.template`}
        control={control}
        render={({ field }) => (
          <TextInput
            label={t('chart.content_template.label')}
            placeholder={t('chart.content_template.placeholder')}
            required
            sx={{ flex: 1 }}
            {...field}
          />
        )}
      />
    </Stack>
  );
}
