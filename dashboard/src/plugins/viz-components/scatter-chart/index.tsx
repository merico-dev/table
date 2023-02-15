import _, { cloneDeep } from 'lodash';
import { VizComponent } from '../../../types/plugin';
import { VersionBasedMigrator } from '../../plugin-data-migrator';
import { DEFAULT_DATA_ZOOM_CONFIG } from '../cartesian/panel/echarts-zooming-field/types';
import { DEFAULT_SERIES_COLOR } from './editors/scatter/series-color-select/types';
import { ClickScatterChartSeries } from './triggers';
import { DEFAULT_CONFIG, DEFAULT_SCATTER_CHART_LABEL_OVERFLOW, IScatterChartConf } from './type';
import { VizScatterChart } from './viz-scatter-chart';
import { VizScatterChartPanel } from './viz-scatter-chart-panel';

function updateToSchema3(legacyConf: $TSFixMe): IScatterChartConf {
  const { dataZoom = DEFAULT_DATA_ZOOM_CONFIG, ...rest } = legacyConf;
  return {
    ...rest,
    dataZoom,
  };
}

function v4(legacyConf: $TSFixMe): IScatterChartConf {
  const patch = {
    scatter: {
      label_overflow: DEFAULT_SCATTER_CHART_LABEL_OVERFLOW,
    },
  };
  return _.defaultsDeep(patch, legacyConf);
}

function v6(legacyConf: $TSFixMe): IScatterChartConf {
  const { color } = legacyConf.scatter;
  if (typeof color === 'string') {
    return {
      ...legacyConf,
      scatter: {
        ...legacyConf.scatter,
        color: {
          ...DEFAULT_SERIES_COLOR.static,
          color,
        },
      },
    };
  }
  return legacyConf;
}

class VizScatterChartMigrator extends VersionBasedMigrator {
  readonly VERSION = 6;

  configVersions(): void {
    this.version(1, (data: any) => {
      return {
        version: 1,
        config: data,
      };
    });
    this.version(2, (data) => {
      const { tooltip = { metrics: [] }, ...rest } = data.config;
      return {
        ...data,
        version: 2,
        config: {
          ...rest,
          tooltip,
        },
      };
    });
    this.version(3, (data) => {
      return {
        ...data,
        version: 3,
        config: updateToSchema3(data.config),
      };
    });
    this.version(4, (data) => {
      const { config } = data;
      return { ...data, version: 5, config: v4(config) };
    });
    this.version(6, (data) => {
      const { config } = data;
      return { ...data, version: 6, config: v6(config) };
    });
  }
}

export const ScatterChartVizComponent: VizComponent = {
  displayName: 'Scatter Chart',
  migrator: new VizScatterChartMigrator(),
  name: 'scatterChart',
  viewRender: VizScatterChart,
  configRender: VizScatterChartPanel,
  createConfig() {
    return {
      version: 6,
      config: cloneDeep(DEFAULT_CONFIG) as IScatterChartConf,
    };
  },
  triggers: [ClickScatterChartSeries],
};
