import { VizComponent } from '~/types/plugin';
import { VersionBasedMigrator } from '~/plugins/plugin-data-migrator';
import { VizBoxplotChart } from './viz-boxplot-chart';
import { VizBoxplotChartPanel } from './viz-boxplot-chart-panel';
import { DEFAULT_CONFIG, IBoxplotChartConf } from './type';
import { ITemplateVariable } from '~/utils/template';
import { omit } from 'lodash';
import { defaultNumbroFormat } from '~/panel/settings/common/numbro-format-selector';
import { ClickBoxplotSeries } from './triggers';
import { DEFAULT_X_AXIS_LABEL_FORMATTER } from '../cartesian/panel/x-axis/x-axis-label-formatter/types';

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

export class VizBoxplotChartMigrator extends VersionBasedMigrator {
  readonly VERSION = 4;

  configVersions(): void {
    this.version(1, (data: $TSFixMe) => {
      return {
        version: 1,
        config: data,
      };
    });
    this.version(2, (data: $TSFixMe, { panelModel }) => {
      const { config } = data;
      const variables = (config.variables || []) as ITemplateVariable[];
      variables.forEach((v) => {
        if (!panelModel.variables.find((vv) => vv.name === v.name)) {
          panelModel.addVariable(v);
        }
      });
      return { config: updateSchema2(config) };
    });
    this.version(3, (data: $TSFixMe) => {
      const { config } = data;
      return { version: 3, config: updateToSchema3(config) };
    });
    this.version(4, (data: $TSFixMe) => {
      const { config } = data;
      return { version: 4, config: updateToSchema4(config) };
    });
  }
}

export const BoxplotChartVizComponent: VizComponent = {
  displayName: 'Boxplot',
  migrator: new VizBoxplotChartMigrator(),
  name: 'boxplot',
  viewRender: VizBoxplotChart,
  configRender: VizBoxplotChartPanel,
  createConfig: (): IBoxplotChartConf => DEFAULT_CONFIG,
  triggers: [ClickBoxplotSeries],
};
