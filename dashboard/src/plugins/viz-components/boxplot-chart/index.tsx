import { VizComponent } from '../../../types/plugin';
import { VersionBasedMigrator } from '../../plugin-data-migrator';
import { VizBoxplotChart } from './viz-boxplot-chart';
import { VizBoxplotChartPanel } from './viz-boxplot-chart-panel';
import { DEFAULT_CONFIG, IBoxplotChartConf } from './type';

class VizBoxplotChartMigrator extends VersionBasedMigrator {
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

export const BoxplotChartVizComponent: VizComponent = {
  displayName: 'Boxplot',
  migrator: new VizBoxplotChartMigrator(),
  name: 'boxplot',
  viewRender: VizBoxplotChart,
  configRender: VizBoxplotChartPanel,
  createConfig: (): IBoxplotChartConf => DEFAULT_CONFIG,
};
