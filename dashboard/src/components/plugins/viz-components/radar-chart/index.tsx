import _ from 'lodash';
import { defaultNumberFormat } from '~/utils';
import { IMigrationEnv, VersionBasedMigrator } from '~/components/plugins/plugin-data-migrator';
import { VizComponent } from '~/types/plugin';
import { ClickRadarChartSeries } from './triggers/click-radar-chart';
import { DEFAULT_CONFIG, IRadarChartConf, IRadarChartDimension } from './type';
import { VizRadarChart } from './viz-radar-chart';
import { VizRadarChartEditor } from './viz-radar-chart-editor';
import { translation } from './translation';

// replace withDefaults function in editor
function v2(prev: $TSFixMe): IRadarChartConf {
  const { dimensions = [], ...rest } = prev;
  function setDefaults({ name = '', data_key = '', max = 10, formatter = defaultNumberFormat }: any) {
    return {
      name,
      data_key,
      max,
      formatter,
    };
  }
  return {
    ...rest,
    dimensions: dimensions.map(setDefaults),
  };
}

function v3(prev: $TSFixMe): IRadarChartConf {
  const { dimensions = [], ...rest } = prev;
  return {
    ...rest,
    dimensions: dimensions.map((d: IRadarChartDimension) => ({
      ...d,
      id: d.id ?? d.name,
    })),
  };
}

function v4(prev: $TSFixMe): IRadarChartConf {
  const patch = {
    background: {
      enabled: true,
    },
    label: {
      enabled: true,
    },
  };
  return _.defaultsDeep(patch, prev);
}

function v5(legacyConf: any, { panelModel }: IMigrationEnv): IRadarChartConf {
  try {
    const queryID = panelModel.queryIDs[0];
    if (!queryID) {
      throw new Error('cannot migrate when queryID is empty');
    }
    const changeKey = (key: string) => (key ? `${queryID}.${key}` : key);
    const { series_name_key, dimensions, ...rest } = legacyConf;
    return {
      ...rest,
      series_name_key: changeKey(series_name_key),
      dimensions: dimensions.map((d: any) => ({
        ...d,
        data_key: changeKey(d.data_key),
      })),
    };
  } catch (error) {
    console.error('[Migration failed]', error);
    throw error;
  }
}

function v6(legacyConf: $TSFixMe): IRadarChartConf {
  const patch = {
    additional_series: [],
  };
  return _.defaultsDeep(patch, legacyConf);
}

function v7(legacyConf: $TSFixMe): IRadarChartConf {
  const ret = {
    ...legacyConf,
    dimensions: legacyConf.dimensions.map((d: any) => ({
      ...d,
      max: String(d.max),
    })),
  };
  delete ret.additionalSeries;
  return ret;
}

class VizRadarChartMigrator extends VersionBasedMigrator {
  readonly VERSION = 7;

  configVersions(): void {
    this.version(1, (data: $TSFixMe) => {
      return {
        version: 1,
        config: data,
      };
    });
    this.version(2, (data) => {
      const { config } = data;
      return { ...data, version: 2, config: v2(config) };
    });
    this.version(3, (data) => {
      const { config } = data;
      return { ...data, version: 3, config: v3(config) };
    });
    this.version(4, (data) => {
      const { config } = data;
      return { ...data, version: 4, config: v4(config) };
    });
    this.version(5, (data, env) => {
      const { config } = data;
      return { ...data, version: 5, config: v5(config, env) };
    });
    this.version(6, (data) => {
      const { config } = data;
      return { ...data, version: 6, config: v6(config) };
    });
    this.version(7, (data) => {
      const { config } = data;
      return { ...data, version: 7, config: v7(config) };
    });
  }
}

export const RadarChartVizComponent: VizComponent = {
  displayName: 'viz.radar_chart.viz_name',
  displayGroup: 'chart.groups.echarts_based_charts',
  migrator: new VizRadarChartMigrator(),
  name: 'radar',
  viewRender: VizRadarChart,
  configRender: VizRadarChartEditor,
  createConfig: (): {
    version: number;
    config: IRadarChartConf;
  } => ({
    version: 7,
    config: DEFAULT_CONFIG,
  }),
  triggers: [ClickRadarChartSeries],
  translation,
};
