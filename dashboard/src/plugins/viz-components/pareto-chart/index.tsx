import { VizComponent } from '../../../types/plugin';
import { VersionBasedMigrator } from '../../plugin-data-migrator';
import { ClickParetoSeries } from './triggers';
import { DEFAULT_CONFIG, IParetoChartConf } from './type';
import { VizParetoChart } from './viz-pareto-chart';
import { VizParetoChartPanel } from './viz-pareto-chart-panel';

class VizParetoChartMigrator extends VersionBasedMigrator {
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

export const ParetoChartVizComponent: VizComponent = {
  displayName: 'Pareto Chart',
  migrator: new VizParetoChartMigrator(),
  name: 'paretoChart',
  viewRender: VizParetoChart,
  configRender: VizParetoChartPanel,
  createConfig: (): IParetoChartConf => DEFAULT_CONFIG,
  triggers: [ClickParetoSeries],
};
