import { EExperSystemScenario, IExpertSystemConf } from '../../type';
import { buildPayloadForPerformance } from './performance';

export function buildPayload(conf: IExpertSystemConf, data: any) {
  switch (conf.scenario) {
    case EExperSystemScenario.performance:
      return buildPayloadForPerformance(conf, data);
    default:
      return {};
  }
}
