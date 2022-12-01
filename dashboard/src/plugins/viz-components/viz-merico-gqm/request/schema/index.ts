import { IMericoGQMConf } from '../../type';

export async function getExpertDataSchema(conf: IMericoGQMConf) {
  return import(`./${conf.scenario}/${conf.metric_set}.schema.json`);
}

export async function getExpertDataStructure(conf: IMericoGQMConf) {
  try {
    const file = await import(`./${conf.scenario}/${conf.metric_set}.structure.ts`);
    return file.default;
  } catch (error) {
    console.error(error);
    return '';
  }
}
