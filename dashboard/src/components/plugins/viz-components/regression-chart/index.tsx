import { VersionBasedMigrator } from '~/components/plugins/plugin-data-migrator';
import { VizComponent } from '~/types/plugin';
import * as Migrators from './migrators';
import { VizRegressionChart } from './render';
import { translation } from './translation';
import { getDefaultConfig } from './type';
import { VizRegressionChartEditor } from './viz-regression-chart-editor';

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
  displayName: 'viz.regression_chart.viz_name',
  displayGroup: 'chart.groups.merico_suite',
  migrator: new VizRegressionChartMigrator(),
  name: 'regressionChart',
  viewRender: VizRegressionChart,
  configRender: VizRegressionChartEditor,
  createConfig() {
    return {
      version: 3,
      config: getDefaultConfig(),
    };
  },
  translation,
};
