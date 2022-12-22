import { VizComponent } from '../../../types/plugin';
import { VersionBasedMigrator } from '../../plugin-data-migrator';
import { VizButton } from './viz-button';
import { VizButtonPanel } from './viz-button-panel';
import { DEFAULT_CONFIG, IButtonConf } from './type';
import { ClickButton } from './triggers';

class VizButtonMigrator extends VersionBasedMigrator {
  readonly VERSION = 1;

  configVersions(): void {
    this.version(1, (data: any) => {
      return {
        version: 1,
        config: data,
      };
    });
    this.version(2, ({ horizontal_align = 'left', ...rest }: any) => {
      return {
        version: 2,
        config: {
          ...rest,
          horizontal_align,
        },
      };
    });
  }
}

export const ButtonVizComponent: VizComponent = {
  displayName: 'Button',
  migrator: new VizButtonMigrator(),
  name: 'button',
  viewRender: VizButton,
  configRender: VizButtonPanel,
  createConfig: (): IButtonConf => DEFAULT_CONFIG,
  triggers: [ClickButton],
};
