import { random } from 'chroma-js';
import _ from 'lodash';
import { getDefaultAxisLabelOverflow } from '~/components/plugins/common-echarts-fields/axis-label-overflow';
import { getDefaultSeriesUnit } from '~/components/plugins/common-echarts-fields/series-unit';
import { IEchartsTooltipMetric } from '~/components/plugins/common-echarts-fields/tooltip-metric';
import { IMigrationEnv, VersionBasedMigrator } from '~/components/plugins/plugin-data-migrator';
import { PanelModelInstance } from '~/dashboard-editor';
import { AnyObject } from '~/types';
import { transformTemplateToRichText } from '~/utils';
import { DEFAULT_DATA_ZOOM_CONFIG } from '../../cartesian/editors/echarts-zooming-field/types';
import { DEFAULT_SERIES_COLOR } from '../editors/scatter/series-color-select/types';
import { getDefaultScatterLabelOverfow, IScatterChartConf } from '../type';

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

function v11(legacyConf: any, panelModel: PanelModelInstance): IScatterChartConf {
  const { stats, ...rest } = legacyConf;
  const top = transformTemplateToRichText(stats.templates.top, panelModel);
  const bottom = transformTemplateToRichText(stats.templates.bottom, panelModel);
  return {
    stats: {
      top: top ?? '',
      bottom: bottom ?? '',
    },
    ...rest,
  };
}

function v12(legacyConf: any): IScatterChartConf {
  const { tooltip, ...rest } = legacyConf;
  const metrics = tooltip.metrics as IEchartsTooltipMetric[];
  return {
    ...rest,
    tooltip: {
      ...tooltip,
      metrics: metrics.map((m) => ({
        ...m,
        unit: m.unit ?? getDefaultSeriesUnit(),
      })),
    },
  };
}

function v13(legacyConf: any): IScatterChartConf {
  const { scatter, x_axis } = legacyConf;
  return {
    ...legacyConf,
    x_axis: {
      ...x_axis,
      unit: x_axis.unit ?? getDefaultSeriesUnit(),
    },
    scatter: {
      ...scatter,
      unit: scatter.unit ?? getDefaultSeriesUnit(),
    },
  };
}
export class VizScatterChartMigrator extends VersionBasedMigrator {
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
    this.version(11, (data, env) => {
      const { config } = data;
      return { ...data, version: 11, config: v11(config, env.panelModel) };
    });
    this.version(12, (data) => {
      const { config } = data;
      return { ...data, version: 12, config: v12(config) };
    });
    this.version(13, (data) => {
      const { config } = data;
      return { ...data, version: 13, config: v13(config) };
    });
  }
  readonly VERSION = 13;
}
