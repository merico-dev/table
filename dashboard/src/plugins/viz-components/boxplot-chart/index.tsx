import _, { cloneDeep, omit } from 'lodash';
import { defaultNumbroFormat } from '~/panel/settings/common/numbro-format-selector';
import { VersionBasedMigrator } from '~/plugins/plugin-data-migrator';
import { VizComponent } from '~/types/plugin';
import { ITemplateVariable } from '~/utils/template';
import { DEFAULT_X_AXIS_LABEL_FORMATTER } from '../cartesian/panel/x-axis/x-axis-label-formatter/types';
import { ClickBoxplotSeries } from './triggers';
import { DEFAULT_CONFIG, IBoxplotChartConf } from './type';
import { VizBoxplotChart } from './viz-boxplot-chart';
import { VizBoxplotChartPanel } from './viz-boxplot-chart-panel';

function updateSchema2(legacyConf: IBoxplotChartConf & { variables: ITemplateVariable[] }): IBoxplotChartConf {
  return omit(legacyConf, 'variables');
}

function updateToSchema3(legacyConf: $TSFixMe): IBoxplotChartConf {
  const { label_formatter = defaultNumbroFormat, ...rest } = legacyConf.y_axis;
  return {
    ...legacyConf,
    y_axis: {
      ...rest,
      label_formatter,
    },
  };
}

function updateToSchema4(legacyConf: $TSFixMe): IBoxplotChartConf {
  const defaultXAxisLabel = {
    rotate: 0,
    formatter: { ...DEFAULT_X_AXIS_LABEL_FORMATTER },
  };

  const { axisLabel = defaultXAxisLabel, ...rest } = legacyConf.x_axis;
  return {
    ...legacyConf,
    x_axis: {
      ...rest,
      axisLabel,
    },
  };
}

function v5(legacyConf: $TSFixMe): IBoxplotChartConf {
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

function v6(legacyConf: $TSFixMe): IBoxplotChartConf {
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
  const ret = _.defaultsDeep(patch, legacyConf);

  console.log('🟦 Migration on boxplot is over');
  console.log(ret);
  return ret;
}

export class VizBoxplotChartMigrator extends VersionBasedMigrator {
  readonly VERSION = 6;

  configVersions(): void {
    this.version(1, (data) => {
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
      return { ...data, version: 2, config: updateSchema2(config) };
    });
    this.version(3, (data) => {
      const { config } = data;
      return { ...data, version: 3, config: updateToSchema3(config) };
    });
    this.version(4, (data) => {
      const { config } = data;
      return { ...data, version: 4, config: updateToSchema4(config) };
    });
    this.version(5, (data) => {
      const { config } = data;
      return { ...data, version: 5, config: v5(config) };
    });
    this.version(6, (data) => {
      const { config } = data;
      return { ...data, version: 6, config: v6(config) };
    });
  }
}

export const BoxplotChartVizComponent: VizComponent = {
  displayName: 'Boxplot Chart',
  displayGroup: 'ECharts-based charts',
  migrator: new VizBoxplotChartMigrator(),
  name: 'boxplot',
  viewRender: VizBoxplotChart,
  configRender: VizBoxplotChartPanel,
  createConfig() {
    return {
      version: 6,
      config: cloneDeep(DEFAULT_CONFIG) as IBoxplotChartConf,
    };
  },
  triggers: [ClickBoxplotSeries],
};
