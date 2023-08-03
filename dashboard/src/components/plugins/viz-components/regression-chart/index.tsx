import { VizComponent } from '~/types/plugin';
import { VersionBasedMigrator } from '~/components/plugins/plugin-data-migrator';
import { VizRegressionChart } from './viz-regression-chart';
import { VizRegressionChartEditor } from './viz-regression-chart-editor';
import { DEFAULT_CONFIG, IRegressionChartConf } from './type';
import { cloneDeep } from 'lodash';
import * as Migrators from './migrators';

class VizRegressionChartMigrator extends VersionBasedMigrator {
  readonly VERSION = 3;

  configVersions(): void {
    this.version(1, (data: $TSFixMe) => {
      return {
        version: 1,
        config: data,
      };
    });
    this.version(2, (data) => {
      return {
        ...data,
        version: 2,
        config: Migrators.v2(data.config),
      };
    });
    this.version(3, (data, env) => {
      const { config } = data;
      return { ...data, version: 3, config: Migrators.v3(config, env) };
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
      version: 3,
      config: cloneDeep(DEFAULT_CONFIG) as IRegressionChartConf,
    };
  },
};
