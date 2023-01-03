import { VizComponent } from '../../../types/plugin';
import { VersionBasedMigrator } from '../../plugin-data-migrator';
import { VizScatterChart } from './viz-scatter-chart';
import { VizScatterChartPanel } from './viz-scatter-chart-panel';
import { DEFAULT_CONFIG, IScatterChartConf } from './type';
import { ClickScatterChartSeries } from './triggers';

class VizScatterChartMigrator extends VersionBasedMigrator {
  readonly VERSION = 2;

  configVersions(): void {
    this.version(1, (data: any) => {
      return {
        version: 1,
        config: data,
      };
    });
    this.version(2, (data: any) => {
      const { tooltip = { metrics: [] }, ...rest } = data;
      return {
        version: 2,
        config: {
          ...rest,
          tooltip,
        },
      };
    });
  }
}

export const ScatterChartVizComponent: VizComponent = {
  displayName: 'Scatter Chart',
  migrator: new VizScatterChartMigrator(),
  name: 'scatterChart',
  viewRender: VizScatterChart,
  configRender: VizScatterChartPanel,
  createConfig: (): IScatterChartConf => DEFAULT_CONFIG,
  triggers: [ClickScatterChartSeries],
};
