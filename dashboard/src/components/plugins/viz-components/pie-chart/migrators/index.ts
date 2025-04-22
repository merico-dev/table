import { IMigrationEnv } from '~/components/plugins/plugin-data-migrator';
import { getDefaultOthersSector, IPieChartConf } from '../type';
import { getDefaultSeriesOrder } from '~/components/plugins/common-echarts-fields/series-order';
import { getDefaultSeriesUnit } from '~/components/plugins/common-echarts-fields/series-unit';

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

export function v5(legacyConf: any): IPieChartConf {
  const { color = { map: [] }, ...rest } = legacyConf;
  return {
    ...rest,
    color: {
      ...color,
      map: color.map ?? [],
    },
  };
}

export function v6(legacyConf: any): IPieChartConf {
  const { series_order = getDefaultSeriesOrder(), ...rest } = legacyConf;
  return {
    ...rest,
    series_order,
  };
}

export function v7(legacyConf: any): IPieChartConf {
  const { others_sector = getDefaultOthersSector(), ...rest } = legacyConf;
  return {
    ...rest,
    others_sector,
  };
}

export function v8(legacyConf: any): IPieChartConf {
  const { unit } = legacyConf;
  return {
    ...legacyConf,
    unit: unit ?? getDefaultSeriesUnit(),
  };
}
