import { VizComponent } from '~/types/plugin';
import { VersionBasedMigrator } from '~/plugins/plugin-data-migrator';
import { VizBar3dChart } from './viz-bar-3d-chart';
import { VizBar3dChartPanel } from './viz-bar-3d-chart-panel';
import { DEFAULT_CONFIG, IBar3dChartConf } from './type';
import { cloneDeep } from 'lodash';

class VizBar3dChartMigrator extends VersionBasedMigrator {
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

export const Bar3dChartVizComponent: VizComponent = {
  displayName: 'Bar Chart (3D)',
  migrator: new VizBar3dChartMigrator(),
  name: 'bar-3d',
  viewRender: VizBar3dChart,
  configRender: VizBar3dChartPanel,
  createConfig() {
    return {
      version: 1,
      config: cloneDeep(DEFAULT_CONFIG) as IBar3dChartConf,
    };
  },
};
