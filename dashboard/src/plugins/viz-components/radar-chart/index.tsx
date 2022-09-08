import { VizComponent } from '~/types/plugin';
import { VersionBasedMigrator } from '~/plugins/plugin-data-migrator';
import { VizRadarChart } from './viz-radar-chart';
import { VizRadarChartPanel } from './viz-radar-chart-panel';
import { DEFAULT_CONFIG, IRadarChartConf } from './type';

class VizRadarChartMigrator extends VersionBasedMigrator {
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

export const RadarChartVizComponent: VizComponent = {
  displayName: 'Radar Chart',
  migrator: new VizRadarChartMigrator(),
  name: 'radar',
  viewRender: VizRadarChart,
  configRender: VizRadarChartPanel,
  createConfig: (): IRadarChartConf => DEFAULT_CONFIG,
};
