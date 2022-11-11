export enum EExperSystemScenario {
  dev_load = 'dev_load',
  personal_report = 'personal_report',
  performance = 'performance',
  comparison = 'comparison',
}

export interface IExpertSystemConf {
  expertSystemURL: string;
  scenario: EExperSystemScenario;
}

export const DEFAULT_CONFIG: IExpertSystemConf = {
  expertSystemURL: '',
  scenario: EExperSystemScenario.performance,
};
