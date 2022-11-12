import { IExpertSystemConf } from '../../type';

export async function getExpertDataSchema(conf: IExpertSystemConf) {
  return import(`./${conf.scenario}/${conf.metric_set}.schema.json`);
}
