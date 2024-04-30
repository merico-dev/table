import { Divider, Group, Text } from '@mantine/core';
import { Control, UseFormWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { InfoCircle } from 'tabler-icons-react';
import { IEchartsTooltipMetric } from '~/components/plugins/common-echarts-fields/tooltip-metric';
import { FieldArrayTabs } from '~/components/plugins/editor-components';
import { IMericoEstimationChartConf } from '../../type';
import { TooltipMetricField } from './metric';

interface IMetricsField {
  control: Control<IMericoEstimationChartConf, $TSFixMe>;
  watch: UseFormWatch<IMericoEstimationChartConf>;
}

export const MetricsField = ({ control, watch }: IMetricsField) => {
  const { t } = useTranslation();

  const getItem = () => {
    const item: IEchartsTooltipMetric = {
      id: Date.now().toString(),
      data_key: '',
      name: '',
    };
    return item;
  };

  const renderTabName = (field: IEchartsTooltipMetric, index: number) => {
    const n = field.name.trim();
    return n ? n : index + 1;
  };

  return (
    <>
      <Group spacing={2} sx={{ cursor: 'default', userSelect: 'none' }}>
        <InfoCircle size={14} color="#888" />
        <Text size={14} color="#888">
          设置可以展示在基线图的指标，例如代码当量
        </Text>
      </Group>
      <Divider variant="dashed" my={10} />
      <FieldArrayTabs<IMericoEstimationChartConf, IEchartsTooltipMetric>
        control={control}
        watch={watch}
        name="metrics"
        getItem={getItem}
        addButtonText={t('chart.tooltip.additional_metrics.add')}
        deleteButtonText={t('chart.tooltip.additional_metrics.delete')}
        renderTabName={renderTabName}
      >
        {({ field, index }) => <TooltipMetricField control={control} index={index} />}
      </FieldArrayTabs>
    </>
  );
};
