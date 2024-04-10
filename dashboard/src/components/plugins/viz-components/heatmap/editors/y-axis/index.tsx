import { Divider, Group, NumberInput, Stack, Text, TextInput } from '@mantine/core';
import { Control, Controller, UseFormWatch } from 'react-hook-form';
import { DataFieldSelector } from '~/components/panel/settings/common/data-field-selector';
import { NameTextAlignSelector } from '~/components/plugins/common-echarts-fields/name-text-align';
import { LabelOverflowField } from '../../../../common-echarts-fields/axis-label-overflow';
import { IHeatmapConf } from '../../type';
import { XAxisLabelFormatterField } from '../x-axis/x-axis-label-formatter';
import { useTranslation } from 'react-i18next';

interface IYAxisField {
  watch: UseFormWatch<IHeatmapConf>;
  control: Control<IHeatmapConf, $TSFixMe>;
}

export function YAxisField({ control, watch }: IYAxisField) {
  const { t } = useTranslation();
  watch(['y_axis']);
  return (
    <Stack my={0} p="0" sx={{ position: 'relative' }}>
      <Group grow noWrap>
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
      <Group grow noWrap>
        <Controller
          name="y_axis.nameAlignment"
          control={control}
          render={({ field }) => <NameTextAlignSelector sx={{ flex: 1 }} {...field} />}
        />
      </Group>
      <Divider mb={-15} variant="dashed" label={t('chart.axis.tick_label')} labelPosition="center" />
      <Controller
        name="y_axis.axisLabel.overflow"
        control={control}
        render={({ field }) => <LabelOverflowField {...field} />}
      />
      <Group grow noWrap>
        <Controller
          name="y_axis.axisLabel.rotate"
          control={control}
          render={({ field }) => (
            // @ts-expect-error type of onChange
            <NumberInput
              label={t('chart.rotate')}
              hideControls
              min={-90}
              max={90}
              rightSection={
                <Text size="xs" color="dimmed">
                  {t('chart.degree')}
                </Text>
              }
              sx={{ width: '48%' }}
              styles={{
                rightSection: {
                  width: '4em',
                  justifyContent: 'flex-end',
                  paddingRight: '6px',
                },
              }}
              {...field}
            />
          )}
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
