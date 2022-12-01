import { VizComponent } from '../../../types/plugin';
import { VersionBasedMigrator } from '../../plugin-data-migrator';
import { VizMericoGQM } from './viz-merico-gqm';
import { VizMericoGQMPanel } from './viz-merico-gqm-panel';
import { DEFAULT_CONFIG, IMericoGQMConf } from './type';

class VizMericoGQMMigrator extends VersionBasedMigrator {
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

export const MericoGQMVizComponent: VizComponent = {
  displayName: 'Merico Expert System',
  migrator: new VizMericoGQMMigrator(),
  name: 'expertSystem',
  viewRender: VizMericoGQM,
  configRender: VizMericoGQMPanel,
  createConfig: (): IMericoGQMConf => DEFAULT_CONFIG,
};
