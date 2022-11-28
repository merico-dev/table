import { VizComponent } from '~/types/plugin';
import { VersionBasedMigrator } from '~/plugins/plugin-data-migrator';
import { VizCartesianChart } from './viz-cartesian-chart';
import { VizCartesianPanel } from './viz-cartesian-panel';
import { DEFAULT_CONFIG, ICartesianChartConf } from './type';
import { ClickEchartSeries } from './triggers/click-echart';
import { ITemplateVariable } from '~/utils/template';
import { AnyObject } from '~/types';
import { cloneDeep, omit } from 'lodash';

function updateSchema2(legacyConf: ICartesianChartConf & { variables: ITemplateVariable[] }): AnyObject {
  const cloned = cloneDeep(omit(legacyConf, 'variables'));
  cloned.stats = omit(cloned.stats, 'variables');
  return cloned;
}

class VizCartesianMigrator extends VersionBasedMigrator {
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

export const CartesianVizComponent: VizComponent = {
  displayName: 'Cartesian Chart',
  migrator: new VizCartesianMigrator(),
  name: 'cartesian',
  viewRender: VizCartesianChart,
  configRender: VizCartesianPanel,
  createConfig: (): ICartesianChartConf => DEFAULT_CONFIG,
  triggers: [ClickEchartSeries],
};
