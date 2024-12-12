import { IMigrationEnv } from '~/components/plugins/plugin-data-migrator';
import { IPieChartConf } from '../type';

export function v2(legacyConf: $TSFixMe): IPieChartConf {
  const { color_field = '', ...rest } = legacyConf;
  return {
    ...rest,
    color_field,
  };
}

export function v3(legacyConf: any, { panelModel }: IMigrationEnv): IPieChartConf {
  try {
    const queryID = panelModel.queryIDs[0];
    if (!queryID) {
      throw new Error('cannot migrate when queryID is empty');
    }
    const changeKey = (key: string) => (key ? `${queryID}.${key}` : key);
    const { label_field, value_field, color_field } = legacyConf;
    return {
      label_field: changeKey(label_field),
      value_field: changeKey(value_field),
      color_field: changeKey(color_field),
    } as any;
  } catch (error) {
    console.error('[Migration failed]', error);
    throw error;
  }
}

export function v4(legacyConf: any): IPieChartConf {
  const { radius = ['50%', '80%'], ...rest } = legacyConf;
  return {
    ...rest,
    radius,
  };
}
