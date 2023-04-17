import _, { cloneDeep } from 'lodash';
import { defaultNumbroFormat } from '~/panel/settings/common/numbro-format-selector';
import { VizComponent } from '../../../types/plugin';
import { VersionBasedMigrator } from '../../plugin-data-migrator';
import { DEFAULT_DATA_ZOOM_CONFIG } from '../cartesian/editors/echarts-zooming-field/types';
import { DEFAULT_X_AXIS_LABEL_FORMATTER } from '../cartesian/editors/x-axis/x-axis-label-formatter/types';
import { ClickParetoSeries } from './triggers';
import { DEFAULT_CONFIG, DEFAULT_PARETO_MARK_LINE, IParetoChartConf } from './type';
import { VizParetoChart } from './viz-pareto-chart';
import { VizParetoChartEditor } from './viz-pareto-chart-editor';

function v2(legacyConf: $TSFixMe): IParetoChartConf {
  const { dataZoom = DEFAULT_DATA_ZOOM_CONFIG, ...rest } = legacyConf;
  return {
    ...rest,
    dataZoom,
  };
}

function v3(legacyConf: $TSFixMe): IParetoChartConf {
  const { markLine = DEFAULT_PARETO_MARK_LINE, ...rest } = legacyConf;
  return {
    ...rest,
    markLine,
  };
}

function v4(legacyConf: $TSFixMe): IParetoChartConf {
  const finalAxisLabel = _.defaultsDeep({}, legacyConf.x_axis.axisLabel, {
    rotate: 0,
    formatter: { ...DEFAULT_X_AXIS_LABEL_FORMATTER },
  });

  return {
    ...legacyConf,
    x_axis: {
      ...legacyConf.x_axis,
      axisLabel: finalAxisLabel,
    },
  };
}

function v5(legacyConf: $TSFixMe): IParetoChartConf {
  const { label_formatter = defaultNumbroFormat } = legacyConf.bar;
  return {
    ...legacyConf,
    bar: {
      ...legacyConf.bar,
      label_formatter,
    },
  };
}

function v6(legacyConf: $TSFixMe): IParetoChartConf {
  const patch = {
    x_axis: {
      axisLabel: {
        overflow: {
          x_axis: {
            width: 80,
            overflow: 'truncate',
            ellipsis: '...',
          },
          tooltip: {
            width: 200,
            overflow: 'break',
            ellipsis: '...',
          },
        },
      },
    },
  };
  return _.defaultsDeep(patch, legacyConf);
}

function v7(legacyConf: $TSFixMe): IParetoChartConf {
  const patch = {
    bar: {
      nameAlignment: 'left',
    },
    line: {
      nameAlignment: 'right',
    },
  };
  return _.defaultsDeep(patch, legacyConf);
}

function v8(legacyConf: $TSFixMe): IParetoChartConf {
  console.log(legacyConf);
  const { x_axis, tooltip } = legacyConf.x_axis.axisLabel.overflow;
  const patch = {
    x_axis: {
      axisLabel: {
        overflow: {
          on_axis: x_axis,
          in_tooltip: tooltip,
        },
      },
    },
  };
  return _.defaultsDeep(patch, legacyConf);
}

class VizParetoChartMigrator extends VersionBasedMigrator {
  readonly VERSION = 8;

  configVersions(): void {
    this.version(1, (data: any) => {
      return {
        version: 1,
        config: data,
      };
    });
    this.version(2, (data) => {
      return {
        ...data,
        version: 2,
        config: v2(data.config),
      };
    });
    this.version(3, (data) => {
      return {
        ...data,
        version: 3,
        config: v3(data.config),
      };
    });
    this.version(4, (data) => {
      return {
        ...data,
        version: 4,
        config: v4(data.config),
      };
    });
    this.version(5, (data) => {
      return {
        ...data,
        version: 5,
        config: v5(data.config),
      };
    });
    this.version(6, (data) => {
      return {
        ...data,
        version: 6,
        config: v6(data.config),
      };
    });
    this.version(7, (data) => {
      return {
        ...data,
        version: 7,
        config: v7(data.config),
      };
    });
    this.version(8, (data) => {
      return {
        ...data,
        version: 8,
        config: v8(data.config),
      };
    });
  }
}

export const ParetoChartVizComponent: VizComponent = {
  displayName: 'Pareto Chart',
  displayGroup: 'ECharts-based charts',
  migrator: new VizParetoChartMigrator(),
  name: 'paretoChart',
  viewRender: VizParetoChart,
  configRender: VizParetoChartEditor,
  createConfig() {
    return {
      version: 8,
      config: cloneDeep(DEFAULT_CONFIG) as IParetoChartConf,
    };
  },
  triggers: [ClickParetoSeries],
};
