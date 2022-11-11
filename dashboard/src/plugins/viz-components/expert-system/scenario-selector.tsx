import { Select } from '@mantine/core';
import { EExperSystemScenario, IExpertSystemConf } from './type';

const scenarioOptions = [
  { label: 'dev_load', value: EExperSystemScenario.dev_load },
  { label: 'personal_report', value: EExperSystemScenario.personal_report },
  { label: 'performance', value: EExperSystemScenario.performance },
  { label: 'comparison', value: EExperSystemScenario.comparison, disabled: true },
];

interface IScenarioSelector {
  conf: IExpertSystemConf;
  setConf: (val: IExpertSystemConf) => Promise<void>;
}
export const ScenarioSelector = ({ conf, setConf }: IScenarioSelector) => {
  const handleChange = (v: EExperSystemScenario) => {
    setConf({
      ...conf,
      scenario: v,
    });
  };
  return <Select label="Scenario" data={scenarioOptions} value={conf.scenario} onChange={handleChange} />;
};
