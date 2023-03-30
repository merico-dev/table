import { random } from 'chroma-js';
import _, { cloneDeep, get, omit } from 'lodash';
import { VersionBasedMigrator } from '~/plugins/plugin-data-migrator';
import { AnyObject } from '~/types';
import { VizComponent } from '~/types/plugin';
import { DefaultAggregation } from '~/utils/aggregation';
import { ITemplateVariable } from '~/utils/template';
import { DEFAULT_DATA_ZOOM_CONFIG } from './panel/echarts-zooming-field/types';
import { DEFAULT_X_AXIS_LABEL_FORMATTER } from './panel/x-axis/x-axis-label-formatter/types';
import { ClickEchartSeries } from './triggers/click-echart';
import { DEFAULT_CONFIG, ICartesianChartConf } from './type';
import { VizCartesianChart } from './viz-cartesian-chart';
import { VizCartesianEditor } from './viz-cartesian-editor';

function updateSchema2(legacyConf: ICartesianChartConf & { variables: ITemplateVariable[] }): AnyObject {
  const cloned = cloneDeep(omit(legacyConf, 'variables'));
  cloned.stats = omit(cloned.stats, 'variables');
  return cloned;
}

function updateToSchema3(legacyConf: $TSFixMe): ICartesianChartConf {
  const { rotate, formatter = DEFAULT_X_AXIS_LABEL_FORMATTER } = legacyConf.x_axis.axisLabel;
  return {
    ...legacyConf,
    x_axis: {
      ...legacyConf.x_axis,
      axisLabel: {
        rotate,
        formatter,
      },
    },
  };
}

function updateToSchema4(legacyConf: $TSFixMe): ICartesianChartConf {
  const { dataZoom = DEFAULT_DATA_ZOOM_CONFIG, ...rest } = legacyConf;
  return {
    ...rest,
    dataZoom,
  };
}

function v5(legacyConf: $TSFixMe): ICartesianChartConf {
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

function v6(legacyConf: $TSFixMe): ICartesianChartConf {
  const reference_lines = legacyConf.reference_lines.map((l: AnyObject) => {
    const {
      lineStyle = {
        type: 'dashed',
        width: 1,
        color: random().css(),
      },
      show_in_legend = false,
    } = l;

    return {
      ...l,
      lineStyle,
      show_in_legend,
    };
  });
  return {
    ...legacyConf,
    reference_lines,
  };
}

function v7(legacyConf: $TSFixMe): ICartesianChartConf {
  const reference_lines = legacyConf.reference_lines.map((l: AnyObject) => {
    const { yAxisIndex = 0 } = l;

    return {
      ...l,
      yAxisIndex,
    };
  });
  return {
    ...legacyConf,
    reference_lines,
  };
}

function v8(legacyConf: $TSFixMe): ICartesianChartConf {
  const series = legacyConf.series.map((l: AnyObject) => {
    const { aggregation_on_group = DefaultAggregation } = l;

    return {
      ...l,
      aggregation_on_group,
    };
  });
  return {
    ...legacyConf,
    series,
  };
}

function v9(legacyConf: $TSFixMe): ICartesianChartConf {
  const series = legacyConf.series.map((l: AnyObject) => {
    const { aggregation_on_value = DefaultAggregation } = l;

    return {
      ...l,
      aggregation_on_value,
    };
  });
  return {
    ...legacyConf,
    series,
  };
}

function v10(legacyConf: $TSFixMe): ICartesianChartConf {
  delete legacyConf.config;
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

function v11(legacyConf: any): ICartesianChartConf {
  const { series, ...rest } = legacyConf;
  return {
    ...rest,
    series: series.map((s: any) => {
      const { barMinWidth, barWidth, barMaxWidth } = s;
      if (barMinWidth) {
        return {
          ...s,
          barMinWidth,
          barWidth: '',
          barMaxWidth: barMaxWidth ?? barWidth,
        };
      }
      return {
        ...s,
        barMinWidth: '',
        barWidth,
        barMaxWidth: '',
      };
    }),
  };
}

function v12(legacyConf: any): ICartesianChartConf {
  const { y_axes, ...rest } = legacyConf;
  return {
    ...rest,
    y_axes: y_axes.map((y: any) => {
      const { min = '', max = '' } = y;
      return {
        ...y,
        min,
        max,
      };
    }),
  };
}

function v13(legacyConf: any): ICartesianChartConf {
  const { y_axes, ...rest } = legacyConf;
  return {
    ...rest,
    y_axes: y_axes.map((y: any) => {
      const { nameAlignment = 'left' } = y;
      return {
        ...y,
        nameAlignment,
      };
    }),
  };
}

function v14(legacyConf: any): ICartesianChartConf {
  const { y_axes, ...rest } = legacyConf;
  return {
    ...rest,
    y_axes: y_axes.map((y: any) => {
      const { show = true } = y;
      return {
        ...y,
        show,
      };
    }),
  };
}

export class VizCartesianMigrator extends VersionBasedMigrator {
  readonly VERSION = 14;

  configVersions(): void {
    this.version(1, (data: $TSFixMe) => {
      return {
        version: 1,
        config: data,
      };
    });
    this.version(2, (data, { panelModel }) => {
      const { config } = data;
      const variables = (config.variables || []) as ITemplateVariable[];
      variables.forEach((v) => {
        if (!panelModel.variables.find((vv) => vv.name === v.name)) {
          panelModel.addVariable(v);
        }
      });
      const statVariables = (get(config, 'stats.variables') || []) as ITemplateVariable[];
      statVariables.forEach((v) => {
        if (!panelModel.variables.find((vv) => vv.name === v.name)) {
          panelModel.addVariable(v);
        }
      });
      return { ...data, version: 2, config: updateSchema2(config) };
    });
    this.version(3, (data) => {
      return {
        ...data,
        version: 3,
        config: updateToSchema3(data.config),
      };
    });
    this.version(4, (data) => {
      return {
        ...data,
        version: 4,
        config: updateToSchema4(data.config),
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
    this.version(9, (data) => {
      return {
        ...data,
        version: 9,
        config: v9(data.config),
      };
    });
    this.version(10, (data) => {
      return {
        ...data,
        version: 10,
        config: v10(data.config),
      };
    });
    this.version(11, (data) => {
      return {
        ...data,
        version: 11,
        config: v11(data.config),
      };
    });
    this.version(12, (data) => {
      return {
        ...data,
        version: 12,
        config: v12(data.config),
      };
    });
    this.version(13, (data) => {
      return {
        ...data,
        version: 13,
        config: v13(data.config),
      };
    });
    this.version(14, (data) => {
      return {
        ...data,
        version: 14,
        config: v14(data.config),
      };
    });
  }
}

export const CartesianVizComponent: VizComponent = {
  displayName: 'Cartesian Chart',
  displayGroup: 'ECharts-based charts',
  migrator: new VizCartesianMigrator(),
  name: 'cartesian',
  viewRender: VizCartesianChart,
  configRender: VizCartesianEditor,
  createConfig() {
    return {
      version: 14,
      config: cloneDeep(DEFAULT_CONFIG) as ICartesianChartConf,
    };
  },
  triggers: [ClickEchartSeries],
};
