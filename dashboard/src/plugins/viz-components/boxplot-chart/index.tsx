import { VizComponent } from '~/types/plugin';
import { VersionBasedMigrator } from '~/plugins/plugin-data-migrator';
import { VizBoxplotChart } from './viz-boxplot-chart';
import { VizBoxplotChartPanel } from './viz-boxplot-chart-panel';
import { DEFAULT_CONFIG, IBoxplotChartConf } from './type';
import { ITemplateVariable } from '~/utils/template';
import { omit } from 'lodash';

function updateSchema2(legacyConf: IBoxplotChartConf & { variables: ITemplateVariable[] }): IBoxplotChartConf {
  return omit(legacyConf, 'variables');
}

export class VizBoxplotChartMigrator extends VersionBasedMigrator {
  readonly VERSION = 2;

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
