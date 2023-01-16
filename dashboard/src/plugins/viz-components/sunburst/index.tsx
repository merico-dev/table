import { VizComponent } from '~/types/plugin';
import { VersionBasedMigrator } from '~/plugins/plugin-data-migrator';
import { DEFAULT_CONFIG, ISunburstConf } from './type';
import { VizSunburst } from './viz-sunburst';
import { VizSunburstPanel } from './viz-sunburst-panel';
import { cloneDeep } from 'lodash';

class VizSunburstMigrator extends VersionBasedMigrator {
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

export const SunburstVizComponent: VizComponent = {
  displayName: 'Sunburst',
  migrator: new VizSunburstMigrator(),
  name: 'sunburst',
  viewRender: VizSunburst,
  configRender: VizSunburstPanel,
  createConfig() {
    return {
      version: 1,
      config: cloneDeep(DEFAULT_CONFIG) as ISunburstConf,
    };
  },
};
