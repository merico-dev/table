import { VizComponent } from '~/types/plugin';
import { VersionBasedMigrator } from '~/plugins/plugin-data-migrator';
import { VizBoxplotChart } from './viz-boxplot-chart';
import { VizBoxplotChartPanel } from './viz-boxplot-chart-panel';
import { DEFAULT_CONFIG, IBoxplotChartConf } from './type';
import { ITemplateVariable } from '~/utils/template';
import { omit } from 'lodash';
import { defaultNumbroFormat } from '~/panel/settings/common/numbro-format-selector';

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

export class VizBoxplotChartMigrator extends VersionBasedMigrator {
  readonly VERSION = 3;

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
  }
}

export const BoxplotChartVizComponent: VizComponent = {
  displayName: 'Boxplot',
  migrator: new VizBoxplotChartMigrator(),
  name: 'boxplot',
  viewRender: VizBoxplotChart,
  configRender: VizBoxplotChartPanel,
  createConfig: (): IBoxplotChartConf => DEFAULT_CONFIG,
};
