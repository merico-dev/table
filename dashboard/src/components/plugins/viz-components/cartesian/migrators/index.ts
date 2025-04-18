import { random } from 'chroma-js';
import _, { cloneDeep, omit } from 'lodash';
import { IMigrationEnv } from '~/components/plugins';
import { getDefaultXAxisLabelFormatter } from '~/components/plugins/common-echarts-fields/x-axis-label-formatter';
import { PanelModelInstance } from '~/dashboard-editor';
import { AnyObject } from '~/types';
import { DefaultAggregation, ITemplateVariable, transformTemplateToRichText } from '~/utils';
import { DEFAULT_DATA_ZOOM_CONFIG } from '../editors/echarts-zooming-field/types';
import { ICartesianChartConf } from '../type';

import { VersionBasedMigrator } from '~/components/plugins/plugin-data-migrator';
import { getDefaultLineAreaStyle } from '~/components/plugins/common-echarts-fields/line-area-style';
import { getDefaultSeriesOrder } from '~/components/plugins/common-echarts-fields/series-order';
import { getDefaultSeriesUnit } from '~/components/plugins/common-echarts-fields/series-unit';

export function updateSchema2(legacyConf: ICartesianChartConf & { variables: ITemplateVariable[] }): AnyObject {
  const cloned = cloneDeep(omit(legacyConf, 'variables'));
  cloned.stats = omit(cloned.stats, 'variables');
  return cloned;
}

export function updateToSchema3(legacyConf: $TSFixMe): ICartesianChartConf {
  const { rotate, formatter = getDefaultXAxisLabelFormatter() } = legacyConf.x_axis.axisLabel;
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

export function updateToSchema4(legacyConf: $TSFixMe): ICartesianChartConf {
  const { dataZoom = DEFAULT_DATA_ZOOM_CONFIG, ...rest } = legacyConf;
  return {
    ...rest,
    dataZoom,
  };
}

export function v5(legacyConf: $TSFixMe): ICartesianChartConf {
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

export function v6(legacyConf: $TSFixMe): ICartesianChartConf {
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

export function v7(legacyConf: $TSFixMe): ICartesianChartConf {
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

export function v8(legacyConf: $TSFixMe): ICartesianChartConf {
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

export function v9(legacyConf: $TSFixMe): ICartesianChartConf {
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

export function v10(legacyConf: $TSFixMe): ICartesianChartConf {
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

export function v11(legacyConf: any): ICartesianChartConf {
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

export function v12(legacyConf: any): ICartesianChartConf {
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

export function v13(legacyConf: any): ICartesianChartConf {
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

export function v14(legacyConf: any): ICartesianChartConf {
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

export function v15(legacyConf: any): ICartesianChartConf {
  const { regressions, ...rest } = legacyConf;
  return {
    ...rest,
    regressions: regressions.map((r: any) => {
      const { group_by_key = '' } = r;
      return {
        ...r,
        group_by_key,
      };
    }),
  };
}

export function v16(legacyConf: any): ICartesianChartConf {
  const { series, y_axes, ...rest } = legacyConf;
  return {
    ...rest,
    series: series.map((s: any) => {
      const { hide_in_legend = false, aggregation_on_value = DefaultAggregation } = s;
      return {
        ...s,
        hide_in_legend,
        aggregation_on_value,
      };
    }),
    y_axes: y_axes.map((y: any) => {
      const { min = '', max = '', show = true } = y;
      return {
        ...y,
        min,
        max,
        show,
      };
    }),
  };
}

export function v17(legacyConf: any): ICartesianChartConf {
  const { type = 'category', ...rest } = legacyConf.x_axis;
  return {
    ...legacyConf,
    x_axis: {
      ...rest,
      type,
    },
  };
}

export function v18(legacyConf: any, { panelModel }: IMigrationEnv): ICartesianChartConf {
  try {
    const queryID = panelModel.queryIDs[0];
    if (!queryID) {
      throw new Error('cannot migrate when queryID is empty');
    }
    const changeKey = (key: string) => (key ? `${queryID}.${key}` : key);
    const { x_axis_data_key, series, regressions, ...rest } = legacyConf;
    return {
      ...rest,
      x_axis_data_key: changeKey(x_axis_data_key),
      series: series.map((s: any) => ({
        ...s,
        y_axis_data_key: changeKey(s.y_axis_data_key),
        group_by_key: changeKey(s.group_by_key),
      })),
      regressions: regressions.map((r: any) => ({
        ...r,
        y_axis_data_key: changeKey(r.y_axis_data_key),
        group_by_key: changeKey(r.group_by_key),
      })),
    };
  } catch (error) {
    console.error('[Migration failed]', error);
    throw error;
  }
}
export function v19(legacyConf: any): ICartesianChartConf {
  const { tooltip = { metrics: [] }, ...rest } = legacyConf;
  return {
    ...legacyConf,
    tooltip,
  };
}

export function v20(legacyConf: $TSFixMe, panelModel: PanelModelInstance): ICartesianChartConf {
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

export function v21(legacyConf: any): ICartesianChartConf {
  const { series, ...rest } = legacyConf;
  const newSeries = series.map((s: any) => {
    const { areaStyle = getDefaultLineAreaStyle(), ...restSeries } = s;
    return {
      ...restSeries,
      areaStyle,
    };
  });
  return {
    ...rest,
    series: newSeries,
  };
}

export function v22(legacyConf: any): ICartesianChartConf {
  const { series, ...rest } = legacyConf;
  const newSeries = series.map((s: any) => {
    const { order_in_group = getDefaultSeriesOrder(), ...restSeries } = s;
    return {
      ...restSeries,
      order_in_group,
    };
  });
  return {
    ...rest,
    series: newSeries,
  };
}

export function v23(legacyConf: any): ICartesianChartConf {
  const { series, ...rest } = legacyConf;
  const newSeries = series.map((s: any) => {
    const { unit = getDefaultSeriesUnit(), ...restSeries } = s;
    return {
      ...restSeries,
      unit,
    };
  });
  return {
    ...rest,
    series: newSeries,
  };
}

export class VizCartesianMigrator extends VersionBasedMigrator {
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
      const statVariables = (_.get(config, 'stats.variables') || []) as ITemplateVariable[];
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
    this.version(15, (data) => {
      return {
        ...data,
        version: 15,
        config: v15(data.config),
      };
    });
    this.version(16, (data) => {
      return {
        ...data,
        version: 16,
        config: v16(data.config),
      };
    });
    this.version(17, (data) => {
      return {
        ...data,
        version: 17,
        config: v17(data.config),
      };
    });
    this.version(18, (data, env) => {
      return {
        ...data,
        version: 18,
        config: v18(data.config, env),
      };
    });
    this.version(19, (data) => {
      return {
        ...data,
        version: 19,
        config: v19(data.config),
      };
    });
    this.version(20, (data, env) => {
      return {
        ...data,
        version: 20,
        config: v20(data.config, env.panelModel),
      };
    });
    this.version(21, (data, env) => {
      return {
        ...data,
        version: 21,
        config: v21(data.config),
      };
    });
    this.version(22, (data, env) => {
      return {
        ...data,
        version: 22,
        config: v22(data.config),
      };
    });
    this.version(23, (data, env) => {
      return {
        ...data,
        version: 23,
        config: v23(data.config),
      };
    });
  }
  readonly VERSION = 23;
}
