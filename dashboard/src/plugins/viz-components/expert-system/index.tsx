import { VizComponent } from '../../../types/plugin';
import { VersionBasedMigrator } from '../../plugin-data-migrator';
import { VizExpertSystem } from './viz-expert-system';
import { VizExpertSystemPanel } from './viz-expert-system-panel';
import { DEFAULT_CONFIG, IExpertSystemConf } from './type';

class VizExpertSystemMigrator extends VersionBasedMigrator {
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

export const ExpertSystemVizComponent: VizComponent = {
  displayName: 'Merico Expert System',
  migrator: new VizExpertSystemMigrator(),
  name: 'expertSystem',
  viewRender: VizExpertSystem,
  configRender: VizExpertSystemPanel,
  createConfig: (): IExpertSystemConf => DEFAULT_CONFIG,
};
