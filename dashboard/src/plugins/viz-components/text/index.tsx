import { VizComponent } from '../../../types/plugin';
import { VersionBasedMigrator } from '../../plugin-data-migrator';
import { VizText } from './viz-text';
import { VizTextPanel } from './viz-text-panel';
import { DEFAULT_CONFIG, ITextConf } from './type';

class VizTextMigrator extends VersionBasedMigrator {
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

export const TextVizComponent: VizComponent = {
  displayName: 'Text',
  migrator: new VizTextMigrator(),
  name: 'text',
  viewRender: VizText,
  configRender: VizTextPanel,
  createConfig: (): ITextConf => DEFAULT_CONFIG,
};
