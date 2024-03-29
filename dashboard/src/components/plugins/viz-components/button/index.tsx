import { cloneDeep } from 'lodash';
import { VizComponent } from '~/types/plugin';
import { VersionBasedMigrator } from '../../plugin-data-migrator';
import { ClickButton } from './triggers';
import { DEFAULT_CONFIG, IButtonConf } from './type';
import { VizButton } from './viz-button';
import { VizButtonEditor } from './viz-button-editor';

class VizButtonMigrator extends VersionBasedMigrator {
  readonly VERSION = 2;

  configVersions(): void {
    this.version(1, (data: any) => {
      return {
        version: 1,
        config: data,
      };
    });
    this.version(2, (data) => {
      const { horizontal_align = 'left', vertical_align = 'center', ...rest } = data.config;
      return {
        ...data,
        version: 2,
        config: {
          ...rest,
          horizontal_align,
          vertical_align,
        },
      };
    });
  }
}

export const ButtonVizComponent: VizComponent = {
  displayName: 'Button',
  displayGroup: 'chart.groups.others',
  migrator: new VizButtonMigrator(),
  name: 'button',
  viewRender: VizButton,
  configRender: VizButtonEditor,
  createConfig() {
    return {
      version: 2,
      config: cloneDeep(DEFAULT_CONFIG) as IButtonConf,
    };
  },
  triggers: [ClickButton],
};
