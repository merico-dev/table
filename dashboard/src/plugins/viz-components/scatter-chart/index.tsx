import { VizComponent } from '../../../types/plugin';
import { VersionBasedMigrator } from '../../plugin-data-migrator';
import { VizScatterChart } from './viz-scatter-chart';
import { VizScatterChartPanel } from './viz-scatter-chart-panel';
import { DEFAULT_CONFIG, IScatterChartConf } from './type';

class VizScatterChartMigrator extends VersionBasedMigrator {
  readonly VERSION = 1;

  configVersions(): void {
    this.version(1, (data: any) => {
      return {
        version: 1,
        config: data,
      };
    });
  }
}

export const ScatterChartVizComponent: VizComponent = {
  displayName: 'ScatterChart',
  migrator: new VizScatterChartMigrator(),
  name: 'scatterChart',
  viewRender: VizScatterChart,
  configRender: VizScatterChartPanel,
  createConfig: (): IScatterChartConf => DEFAULT_CONFIG,
};
