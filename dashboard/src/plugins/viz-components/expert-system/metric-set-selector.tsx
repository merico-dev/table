import { Select } from '@mantine/core';
import { useEffect, useMemo } from 'react';
import { EMetricSet, IExpertSystemConf } from './type';

const metricSetOptionGroups: Record<string, { label: string; value: EMetricSet; disabled?: boolean }[]> = {
  dev_load: [
    { label: 'productivity', value: EMetricSet.productivity },
    { label: 'pareto', value: EMetricSet.pareto },
    { label: 'heatmap', value: EMetricSet.heatmap },
  ],
  personal_report: [
    { label: 'skills', value: EMetricSet.skills },
    { label: 'commits', value: EMetricSet.commits },
    { label: 'quality', value: EMetricSet.quality },
  ],
  performance: [
    { label: 'quality', value: EMetricSet.quality },
    { label: 'quality_history', value: EMetricSet.quality_history },
    { label: 'efficiency', value: EMetricSet.efficiency },
    { label: 'pareto', value: EMetricSet.pareto },
  ],
  comparison: [{ label: 'efficiency', value: EMetricSet.efficiency, disabled: true }],
};

interface IMetricSetSelector {
  conf: IExpertSystemConf;
  setConf: (val: IExpertSystemConf) => Promise<void>;
}
export const MetricSetSelector = ({ conf, setConf }: IMetricSetSelector) => {
  const options = useMemo(() => {
    return metricSetOptionGroups[conf.scenario] ?? [];
  }, [conf.scenario]);

  const handleChange = (v: EMetricSet) => {
    setConf({
      ...conf,
      metric_set: v,
    });
  };

  useEffect(() => {
    const match = options.find((o) => o.value === conf.metric_set);
    if (!match) {
      setConf({
        ...conf,
        metric_set: options[0].value,
      });
    }
  }, [options, conf.metric_set, setConf]);

  return (
    <Select
      label="Metric Set"
      data={options}
      value={conf.metric_set}
      onChange={handleChange}
      disabled={options.length === 0}
      required
    />
  );
};
