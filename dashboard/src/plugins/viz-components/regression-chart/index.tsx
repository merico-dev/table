import { VizComponent } from '../../../types/plugin';
import { VersionBasedMigrator } from '../../plugin-data-migrator';
import { VizRegressionChart } from './viz-regression-chart';
import { VizRegressionChartPanel } from './viz-regression-chart-panel';
import { DEFAULT_CONFIG, IRegressionChartConf } from './type';

class VizRegressionChartMigrator extends VersionBasedMigrator {
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

export const RegressionChartVizComponent: VizComponent = {
  displayName: 'Regression Chart',
  migrator: new VizRegressionChartMigrator(),
  name: 'regressionChart',
  viewRender: VizRegressionChart,
  configRender: VizRegressionChartPanel,
  createConfig: (): IRegressionChartConf => DEFAULT_CONFIG,
};
