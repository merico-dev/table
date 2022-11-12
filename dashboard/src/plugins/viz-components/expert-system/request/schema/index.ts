import { IExpertSystemConf } from '../../type';

export async function getExpertDataSchema(conf: IExpertSystemConf) {
  return import(`./${conf.scenario}/${conf.metric_set}.schema.json`);
}

export async function getExpertDataStructure(conf: IExpertSystemConf) {
  try {
    const file = await import(`./${conf.scenario}/${conf.metric_set}.structure.ts`);
    return file.default;
  } catch (error) {
    console.error(error);
    return '';
  }
}
