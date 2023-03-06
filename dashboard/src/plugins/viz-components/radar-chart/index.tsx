import { VizComponent } from '~/types/plugin';
import { VersionBasedMigrator } from '~/plugins/plugin-data-migrator';
import { VizRadarChart } from './viz-radar-chart';
import { VizRadarChartEditor } from './viz-radar-chart-editor';
import { DEFAULT_CONFIG, IRadarChartConf } from './type';
import { cloneDeep } from 'lodash';

class VizRadarChartMigrator extends VersionBasedMigrator {
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

export const RadarChartVizComponent: VizComponent = {
  displayName: 'Radar Chart',
  displayGroup: 'ECharts-based charts',
  migrator: new VizRadarChartMigrator(),
  name: 'radar',
  viewRender: VizRadarChart,
  configRender: VizRadarChartEditor,
  createConfig() {
    return {
      version: 1,
      config: cloneDeep(DEFAULT_CONFIG) as IRadarChartConf,
    };
  },
};
