import { VizComponent } from '../../../types/plugin';
import { VersionBasedMigrator } from '../../plugin-data-migrator';
import { ISunburstConf } from './type';
import { VizSunburst } from './viz-sunburst';
import { VizSunburstPanel } from './viz-sunburst-panel';

class VizSunburstMigrator extends VersionBasedMigrator {
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

export const SunburstVizComponent: VizComponent = {
  displayName: 'Sunburst',
  migrator: new VizSunburstMigrator(),
  name: 'sunburst',
  viewRender: VizSunburst,
  configRender: VizSunburstPanel,
  createConfig: (): ISunburstConf => ({ label_field: '', value_field: '' }),
};
