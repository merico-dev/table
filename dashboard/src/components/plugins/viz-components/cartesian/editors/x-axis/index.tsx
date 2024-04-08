import {
  ActionIcon,
  Anchor,
  Divider,
  Group,
  HoverCard,
  NumberInput,
  Select,
  Stack,
  Text,
  TextInput,
  Tooltip,
} from '@mantine/core';
import { Control, Controller, UseFormWatch } from 'react-hook-form';
import { DataFieldSelector } from '~/components/panel/settings/common/data-field-selector';
import { LabelOverflowField } from '~/components/plugins/common-echarts-fields/axis-label-overflow';
import { ICartesianChartConf } from '../../type';
import { XAxisLabelFormatterField } from './x-axis-label-formatter';
import { IconInfoCircle } from '@tabler/icons-react';
import { Trans, useTranslation } from 'react-i18next';
import { useMemo } from 'react';

//https://echarts.apache.org/zh/option.html#xAxis.type
const XAxisTypeLabel = () => {
  const { t } = useTranslation();
  return (
    <Group sx={{ display: 'inline-flex' }} spacing={6} mr={14}>
      <Text>{t('chart.x_axis.x_axis_type')}</Text>
      <HoverCard width={340} shadow="md" position="top">
        <HoverCard.Target>
          <ActionIcon size="xs" sx={{ transform: 'none !important' }}>
            <IconInfoCircle />
          </ActionIcon>
        </HoverCard.Target>
        <HoverCard.Dropdown>
          <Text size="sm">
            <Trans i18nKey="chart.axis.type.click_to_learn_more">
              Click
              <Anchor href="https://echarts.apache.org/en/option.html#xAxis.type" target="_blank" mx={3}>
                here
              </Anchor>
              to learn more about these options
            </Trans>
          </Text>
        </HoverCard.Dropdown>
      </HoverCard>
    </Group>
  );
};

interface IXAxisField {
  control: Control<ICartesianChartConf, $TSFixMe>;
  watch: UseFormWatch<ICartesianChartConf>;
}
export function XAxisField({ control, watch }: IXAxisField) {
  const { t, i18n } = useTranslation();
  watch(['x_axis_data_key', 'x_axis_name', 'x_axis']);

  const XAxisTypeOptions = useMemo(
    () => [
      { label: t('chart.axis.type.value'), value: 'value' },
      { label: t('chart.axis.type.category'), value: 'category' },
      { label: t('chart.axis.type.time'), value: 'time' },
      { label: t('chart.axis.type.log'), value: 'log' },
    ],
    [i18n.language],
  );
  return (
    <Stack>
      <Controller
        name="x_axis_name"
        control={control}
        render={({ field }) => <TextInput label={t('chart.x_axis.x_axis_name')} sx={{ flex: 1 }} {...field} />}
      />
      <Group grow noWrap>
        <Controller
          name="x_axis_data_key"
          control={control}
          render={({ field }) => (
            <DataFieldSelector label={t('chart.x_axis.x_axis_data_field')} required sx={{ flex: 1 }} {...field} />
          )}
        />
        <Controller
          name="x_axis.type"
          control={control}
          render={({ field }) => (
            // @ts-expect-error type of onChange
            <Select label={<XAxisTypeLabel />} required data={XAxisTypeOptions} sx={{ flex: 1 }} {...field} />
          )}
        />
      </Group>
      <Divider mb={-15} label={t('chart.axis.tick_label')} labelPosition="center" />
      <Group grow noWrap>
        <Controller
          name="x_axis.axisLabel.rotate"
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
          name="x_axis.axisLabel.formatter"
          control={control}
          render={({ field }) => <XAxisLabelFormatterField {...field} />}
        />
      </Group>
      <Controller
        name="x_axis.axisLabel.overflow"
        control={control}
        render={({ field }) => <LabelOverflowField {...field} />}
      />
    </Stack>
  );
}
