import { VizComponent } from '~/types/plugin';
import { VersionBasedMigrator } from '~/plugins/plugin-data-migrator';
import { VizPieChart } from './viz-pie-chart';
import { VizPieChartPanel } from './viz-pie-chart-panel';
import { DEFAULT_CONFIG, IPieChartConf } from './type';

class VizPieChartMigrator extends VersionBasedMigrator {
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

export const PieChartVizComponent: VizComponent = {
  displayName: 'Pie Chart',
  migrator: new VizPieChartMigrator(),
  name: 'pie',
  viewRender: VizPieChart,
  configRender: VizPieChartPanel,
  createConfig: (): IPieChartConf => DEFAULT_CONFIG,
};
