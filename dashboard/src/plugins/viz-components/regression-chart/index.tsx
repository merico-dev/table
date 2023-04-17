import { VizComponent } from '~/types/plugin';
import { VersionBasedMigrator } from '~/plugins/plugin-data-migrator';
import { VizRegressionChart } from './viz-regression-chart';
import { VizRegressionChartEditor } from './viz-regression-chart-editor';
import { DEFAULT_CONFIG, IRegressionChartConf } from './type';
import { cloneDeep } from 'lodash';

class VizRegressionChartMigrator extends VersionBasedMigrator {
  readonly VERSION = 1;

  configVersions(): void {
    this.version(1, (data: $TSFixMe) => {
      return {
        version: 1,
        config: data,
      };
    });
  }
}

export const RegressionChartVizComponent: VizComponent = {
  displayName: 'Regression Chart',
  displayGroup: 'Merico suite',
  migrator: new VizRegressionChartMigrator(),
  name: 'regressionChart',
  viewRender: VizRegressionChart,
  configRender: VizRegressionChartEditor,
  createConfig() {
    return {
      version: 1,
      config: cloneDeep(DEFAULT_CONFIG) as IRegressionChartConf,
    };
  },
};
