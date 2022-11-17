import { EExperSystemScenario, IExpertSystemConf } from '../../type';
import { buildPayloadForComparison } from './comparison';
import { buildPayloadForDevLoad } from './dev_load';
import { buildPayloadForPerformance } from './performance';
import { buildPayloadForPersonalReport } from './personal_report';

export function buildPayload(conf: IExpertSystemConf, data: any) {
  switch (conf.scenario) {
    case EExperSystemScenario.performance:
      return buildPayloadForPerformance(conf, data);
    case EExperSystemScenario.dev_load:
      return buildPayloadForDevLoad(conf, data);
    case EExperSystemScenario.personal_report:
      return buildPayloadForPersonalReport(conf, data);
    case EExperSystemScenario.comparison:
      return buildPayloadForComparison(conf, data);
    default:
      return {};
  }
}
