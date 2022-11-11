import { Select } from '@mantine/core';
import { useMemo } from 'react';
import { EMetricSet, IExpertSystemConf } from './type';

const metricSetOptionGroups = {
  dev_load: [
    { label: 'productivity', value: 'productivity' },
    { label: 'pareto', value: 'pareto' },
    { label: 'heatmap', value: 'heatmap' },
  ],
  personal_report: [
    { label: 'skills', value: 'skills' },
    { label: 'commits', value: 'commits' },
    { label: 'quality', value: 'quality' },
  ],
  performance: [
    { label: 'quality', value: 'quality' },
    { label: 'quality_history', value: 'quality_history' },
    { label: 'efficiency', value: 'efficiency' },
    { label: 'pareto', value: 'pareto' },
  ],
  comparison: [],
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
  return (
    <Select
      label="Metric Set"
      data={options}
      value={conf.metric_set}
      onChange={handleChange}
      disabled={options.length === 0}
    />
  );
};
