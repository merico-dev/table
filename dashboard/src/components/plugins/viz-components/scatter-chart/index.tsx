import { random } from 'chroma-js';
import _, { cloneDeep } from 'lodash';
import { AnyObject } from '~/types';
import { VizComponent } from '~/types/plugin';
import { IMigrationEnv, VersionBasedMigrator } from '../../plugin-data-migrator';
import { DEFAULT_DATA_ZOOM_CONFIG } from '../cartesian/editors/echarts-zooming-field/types';
import { DEFAULT_SERIES_COLOR } from './editors/scatter/series-color-select/types';
import { ClickScatterChartSeries } from './triggers';
import { DEFAULT_CONFIG, getDefaultScatterLabelOverfow, IScatterChartConf } from './type';
import { VizScatterChart } from './viz-scatter-chart';
import { VizScatterChartEditor } from './viz-scatter-chart-editor';
import { getDefaultAxisLabelOverflow } from '../../common-echarts-fields/axis-label-overflow';
import { translation } from './translation';

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
      label_overflow: getDefaultScatterLabelOverfow(),
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

function v7(legacyConf: $TSFixMe): IScatterChartConf {
  const reference_lines = legacyConf.reference_lines.map((l: AnyObject) => {
    const {
      lineStyle = {
        type: 'dashed',
        width: 1,
        color: random().css(),
      },
      show_in_legend = false,
      yAxisIndex = 0,
    } = l;

    return {
      ...l,
      lineStyle,
      show_in_legend,
      yAxisIndex,
    };
  });
  return {
    ...legacyConf,
    reference_lines,
  };
}

function v8(legacyConf: $TSFixMe): IScatterChartConf {
  const patch = { tooltip: { trigger: 'item' } };
  return _.defaultsDeep({}, legacyConf, patch);
}

function v9(legacyConf: any, { panelModel }: IMigrationEnv): IScatterChartConf {
  try {
    const queryID = panelModel.queryIDs[0];
    if (!queryID) {
      throw new Error('cannot migrate when queryID is empty');
    }
    const changeKey = (key: string) => (key ? `${queryID}.${key}` : key);
    const { x_axis, scatter, tooltip, ...rest } = legacyConf;
    return {
      ...rest,
      x_axis: {
        ...x_axis,
        data_key: changeKey(x_axis.data_key),
      },
      scatter: {
        ...scatter,
        y_data_key: changeKey(scatter.y_data_key),
        name_data_key: changeKey(scatter.name_data_key),
      },
      tooltip: {
        ...tooltip,
        metrics: tooltip.metrics.map((m: any) => ({
          ...m,
          data_key: changeKey(m.data_key),
        })),
      },
    };
  } catch (error) {
    console.error('[Migration failed]', error);
    throw error;
  }
}

function v10(legacyConf: $TSFixMe): IScatterChartConf {
  const patch = {
    x_axis: {
      axisLabel: {
        overflow: getDefaultAxisLabelOverflow(),
      },
    },
  };
  return _.defaultsDeep(patch, legacyConf);
}

class VizScatterChartMigrator extends VersionBasedMigrator {
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
    this.version(7, (data) => {
      const { config } = data;
      return { ...data, version: 7, config: v7(config) };
    });
    this.version(8, (data) => {
      const { config } = data;
      return { ...data, version: 8, config: v8(config) };
    });
    this.version(9, (data, env) => {
      const { config } = data;
      return { ...data, version: 9, config: v9(config, env) };
    });
    this.version(10, (data, env) => {
      const { config } = data;
      return { ...data, version: 10, config: v10(config) };
    });
  }
  readonly VERSION = 10;
}

export const ScatterChartVizComponent: VizComponent = {
  displayName: 'viz.scatter_chart.viz_name',
  displayGroup: 'chart.groups.echarts_based_charts',
  migrator: new VizScatterChartMigrator(),
  name: 'scatterChart',
  viewRender: VizScatterChart,
  configRender: VizScatterChartEditor,
  createConfig() {
    return {
      version: 10,
      config: cloneDeep(DEFAULT_CONFIG) as IScatterChartConf,
    };
  },
  triggers: [ClickScatterChartSeries],
  translation,
};
