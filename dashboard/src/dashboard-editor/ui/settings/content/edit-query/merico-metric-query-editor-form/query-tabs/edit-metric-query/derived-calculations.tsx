import { MultiSelect, Stack, Text, Loader } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { QueryModelInstance } from '~/dashboard-editor/model';
import { MericoMetricQueryMetaInstance } from '~/model';
import type { DataSourceModelInstance } from '~/dashboard-editor/model/datasources/datasource';

interface IDerivedCalculationMetadata {
  name: string;
  description: string;
  requireWindowConfig: boolean;
  requireTrendingDateCol: boolean;
}

const calculationOptionsMap = new Map<string, IDerivedCalculationMetadata>([
  [
    'accumulate',
    {
      name: '累计计算',
      description: '按指定的聚合方式，依次计算指标值的累计值。',
      requireWindowConfig: false,
      requireTrendingDateCol: false,
    },
  ],
  [
    'yoyRatio',
    {
      name: '年同比率（yoy）',
      description: '对比当前年份与上一个年份同期指标值的变化率。',
      requireWindowConfig: false,
      requireTrendingDateCol: true,
    },
  ],
  [
    'stepRatio',
    {
      name: '环比率',
      description: '对比当前步长与上一个步长指标值的变化率。',
      requireWindowConfig: false,
      requireTrendingDateCol: true,
    },
  ],
  [
    'stepSpansRatio',
    {
      name: '移动计算',
      description: '按设定的窗口沿时序对指标值进行滚动计算。',
      requireWindowConfig: true,
      requireTrendingDateCol: true,
    },
  ],
  [
    'percentage',
    {
      name: '总占比',
      description: '总占比 = 当前值 / 总值。',
      requireWindowConfig: false,
      requireTrendingDateCol: false,
    },
  ],
  [
    'percentage_accumulate',
    {
      name: '累计占比',
      description: '按聚合规则计算各项占比，再依次计算占比率的累计值，如帕累托的累计占比值。',
      requireWindowConfig: false,
      requireTrendingDateCol: false,
    },
  ],
  [
    'accumulate_yoyRatio',
    {
      name: '累计年同比',
      description: '按聚合规则累加数据，再与上一年同期累计值对比得出变化率。',
      requireWindowConfig: false,
      requireTrendingDateCol: true,
    },
  ],
  [
    'yoyRatio_accumulate',
    {
      name: '年同比累计',
      description: '先计算各步长指标相对上一年同期的同比率，再依次计算同比率的累计值。',
      requireWindowConfig: false,
      requireTrendingDateCol: true,
    },
  ],
  [
    'stepRatio_accumulate',
    {
      name: '环比累计',
      description: '先计算各步长指标相对上一步长的环比率，再依次计算环比率的累计值。',
      requireWindowConfig: false,
      requireTrendingDateCol: true,
    },
  ],
  [
    'percentage_yoyRatio',
    {
      name: '占比年同比',
      description: '按聚合规则计算各项占比，再与去年同期占比对比得出变化率。',
      requireWindowConfig: false,
      requireTrendingDateCol: true,
    },
  ],
  [
    'yoyRatio_stepSpansRatio',
    {
      name: '年同比移动计算',
      description: '先计算各步长指标相对上一年同期的同比率，再按移动设置沿时序滚动计算。',
      requireWindowConfig: true,
      requireTrendingDateCol: true,
    },
  ],
  [
    'stepRatio_stepSpansRatio',
    {
      name: '环比移动计算',
      description: '先计算各步长指标相对上一步长的环比率，再按移动设置沿时序滚动计算。',
      requireWindowConfig: true,
      requireTrendingDateCol: true,
    },
  ],
]);

type Props = {
  queryModel: QueryModelInstance;
};

export const DerivedCalculations = observer(({ queryModel }: Props) => {
  const config = queryModel.config as MericoMetricQueryMetaInstance;
  const ds = queryModel.datasource as DataSourceModelInstance;
  const mmInfo = ds.mericoMetricInfo;
  const metricDetail = mmInfo.metricDetail;

  const loading = mmInfo.metrics.loading || metricDetail.loading;
  const error = metricDetail.error;

  if (!config.id) {
    return null;
  }

  if (loading) {
    return (
      <Stack gap={8}>
        <Text size="sm" fw={500}>衍生计算配置</Text>
        <Loader size="xs" />
      </Stack>
    );
  }

  if (error) {
    return (
      <Stack gap={8}>
        <Text size="sm" fw={500}>衍生计算配置</Text>
        <Text size="sm" c="red">加载失败: {error}</Text>
      </Stack>
    );
  }

  if (metricDetail.hasData && metricDetail.data) {
    const extraCalculations = metricDetail.data.extraCalculations;
    
    if (!extraCalculations || extraCalculations.length === 0) {
      return null;
    }

    // Filter available options based on the metric's extraCalculations
    const availableOptions = Array.from(calculationOptionsMap.entries())
      .filter(([key]) => extraCalculations.includes(key))
      .map(([value, data]) => ({
        value,
        label: data.name,
        description: data.description,
      }));

    if (availableOptions.length === 0) {
      return null;
    }

    return (
      <Stack gap={8}>
        <Text size="sm" fw={500}>衍生计算配置</Text>
        <MultiSelect
          data={availableOptions}
          value={config.extraCalculations || []}
          onChange={(values) => config.setExtraCalculations(values)}
          placeholder="选择要使用的计算方式"
          searchable
          clearable
          nothingFoundMessage="未找到可用的计算方式"
        />
      </Stack>
    );
  }

  return null;
});