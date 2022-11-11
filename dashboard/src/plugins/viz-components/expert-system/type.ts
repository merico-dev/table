export enum EExperSystemScenario {
  dev_load = 'dev_load',
  personal_report = 'personal_report',
  performance = 'performance',
  comparison = 'comparison',
}
export enum EMetricSet {
  productivity = 'productivity',
  pareto = 'pareto',
  heatmap = 'heatmap',

  skills = 'skills',
  commits = 'commits',
  // quality = 'quality',

  quality = 'quality',
  quality_history = 'quality_history',
  efficiency = 'efficiency',
  // pareto = 'pareto',
}

export interface IExpertSystemConf {
  expertSystemURL: string;
  scenario: EExperSystemScenario;
  metric_set: EMetricSet;
}

export const DEFAULT_CONFIG: IExpertSystemConf = {
  expertSystemURL: '',
  scenario: EExperSystemScenario.performance,
  metric_set: EMetricSet.quality,
};
