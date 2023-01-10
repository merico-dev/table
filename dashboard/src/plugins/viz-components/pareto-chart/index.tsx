import { VizComponent } from '../../../types/plugin';
import { VersionBasedMigrator } from '../../plugin-data-migrator';
import { DEFAULT_DATA_ZOOM_CONFIG } from '../cartesian/panel/echarts-zooming-field/types';
import { ClickParetoSeries } from './triggers';
import { DEFAULT_CONFIG, IParetoChartConf } from './type';
import { VizParetoChart } from './viz-pareto-chart';
import { VizParetoChartPanel } from './viz-pareto-chart-panel';

function v2(legacyConf: $TSFixMe): IParetoChartConf {
  const { dataZoom = DEFAULT_DATA_ZOOM_CONFIG, ...rest } = legacyConf;
  return {
    ...rest,
    dataZoom,
  };
}

class VizParetoChartMigrator extends VersionBasedMigrator {
  readonly VERSION = 2;

  configVersions(): void {
    this.version(1, (data: any) => {
      return {
        version: 1,
        config: data,
      };
    });
    this.version(2, (data: any) => {
      return {
        version: 2,
        config: v2(data),
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
