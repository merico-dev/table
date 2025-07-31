import type { MultiSelectProps } from '@mantine/core';
import { Group, Loader, MultiSelect, Stack, Text, Tooltip } from '@mantine/core';
import { toJS } from 'mobx';
import { observer } from 'mobx-react-lite';
import { useEffect, useRef } from 'react';
import { QueryModelInstance } from '~/dashboard-editor/model';
import type { DataSourceModelInstance } from '~/dashboard-editor/model/datasources/datasource';
import {
  calculationOptionsMap,
  removeTrendingBasedCalculations,
} from '~/dashboard-editor/model/datasources/mm-info/metric-detail.utils';
import { MericoMetricQueryMetaInstance } from '~/model';

interface IWindowConfig {
  calculation: string;
  n: number;
  direction: 'forward' | 'backward';
}

// Parse window config from extraCalculationConfig
const parseWindowConfig = (configStr: string | undefined): IWindowConfig | null => {
  if (!configStr) return null;

  try {
    const config = JSON.parse(configStr);
    return {
      calculation: config.calculation,
      n: config.n,
      direction: config.direction,
    };
  } catch {
    return null;
  }
};

// Generate available options for the multi-select
const generateAvailableOptions = (
  extraCalculations: string[],
  windowConfig: IWindowConfig | null,
  timeQueryEnabled: boolean,
) => {
  const calculationNames: Record<string, string> = {
    max: '最大值',
    min: '最小值',
    sum: '总和',
    avg: '平均值',
  };

  return Array.from(calculationOptionsMap.entries())
    .filter(([key]) => extraCalculations.includes(key))
    .map(([value, data]) => {
      const isTimeQueryDisabled = !timeQueryEnabled;
      const requiresWindowConfig = data.requireWindowConfig;
      const shouldBeDisabled = isTimeQueryDisabled && requiresWindowConfig;

      let label = data.name;

      // Append window config to label for window-based calculations
      if (requiresWindowConfig && windowConfig) {
        const calculationName = calculationNames[windowConfig.calculation] || windowConfig.calculation;
        const directionText = windowConfig.direction === 'forward' ? '向前' : '向后';
        label = `${data.name} · ${calculationName} · ${windowConfig.n} 个步长 · ${directionText}`;
      }

      return {
        value,
        label,
        description: data.description,
        disabled: shouldBeDisabled,
        disabledReason: shouldBeDisabled ? '需要开启按时序查询' : undefined,
      };
    });
};

type Props = {
  queryModel: QueryModelInstance;
};

// Custom render option for MultiSelect to show description
const renderOption: MultiSelectProps['renderOption'] = (item) => {
  const option = item.option as {
    value: string;
    label: string;
    description: string;
    disabled?: boolean;
    disabledReason?: string;
  };

  const content = (
    <Group gap="xs" wrap="nowrap">
      <div>
        <Text size="sm" fw={500}>
          {option.label}
        </Text>
        <Text size="xs" c="dimmed">
          {option.description}
        </Text>
      </div>
    </Group>
  );

  if (option.disabled && option.disabledReason) {
    return (
      <Tooltip label={option.disabledReason} position="top" withArrow>
        <div {...item} style={{ opacity: 0.6, cursor: 'not-allowed' }}>
          {content}
        </div>
      </Tooltip>
    );
  }

  return <div {...item}>{content}</div>;
};

export const DerivedCalculations = observer(({ queryModel }: Props) => {
  const config = queryModel.config as MericoMetricQueryMetaInstance;
  const ds = queryModel.datasource as DataSourceModelInstance;
  const mmInfo = ds.mericoMetricInfo;
  const metricDetail = mmInfo.metricDetail;

  const loading = mmInfo.metrics.loading || metricDetail.loading;
  const error = metricDetail.error;

  // Track previous timeQuery state to detect when it changes from enabled to disabled
  const prevTimeQueryEnabled = useRef(config.timeQuery.enabled);

  useEffect(() => {
    if (prevTimeQueryEnabled.current && !config.timeQuery.enabled) {
      // TimeQuery was just disabled, remove trending-based calculations
      const currentCalculations = toJS(config.extraCalculations) || [];
      const filteredCalculations = removeTrendingBasedCalculations(currentCalculations, false);
      if (filteredCalculations.length !== currentCalculations.length) {
        config.setExtraCalculations(filteredCalculations);
      }
    }

    // Update the previous state
    prevTimeQueryEnabled.current = config.timeQuery.enabled;
  }, [config.timeQuery.enabled]);

  if (!config.id) {
    return null;
  }

  if (loading) {
    return (
      <Stack gap={8}>
        <Text size="sm" fw={500}>
          衍生计算配置
        </Text>
        <Loader size="xs" />
      </Stack>
    );
  }

  if (error) {
    return (
      <Stack gap={8}>
        <Text size="sm" fw={500}>
          衍生计算配置
        </Text>
        <Text size="sm" c="red">
          加载失败: {error}
        </Text>
      </Stack>
    );
  }

  if (metricDetail.hasData && metricDetail.data) {
    const extraCalculations = metricDetail.data.extraCalculations;

    if (!extraCalculations || extraCalculations.length === 0) {
      return null;
    }

    // Parse window config for display
    const windowConfig = parseWindowConfig(metricDetail.data.extraCalculationConfig);

    // Generate available options for the multi-select
    const availableOptions = generateAvailableOptions(extraCalculations, windowConfig, config.timeQuery.enabled);

    if (availableOptions.length === 0) {
      return null;
    }

    return (
      <Stack gap={8}>
        <Text size="sm" fw={500}>
          衍生计算配置
        </Text>
        <MultiSelect
          data={availableOptions}
          value={toJS(config.extraCalculations) || []}
          onChange={(values) => config.setExtraCalculations(values)}
          placeholder="选择要使用的计算方式"
          searchable
          clearable
          nothingFoundMessage="未找到可用的计算方式"
          renderOption={renderOption}
          maxDropdownHeight={300}
        />
      </Stack>
    );
  }

  return null;
});
