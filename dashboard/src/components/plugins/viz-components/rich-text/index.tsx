import { cloneDeep, defaults } from 'lodash';
import { VizComponent } from '~/types/plugin';
import { VersionBasedMigrator } from '~/components/plugins/plugin-data-migrator';
import { DEFAULT_CONFIG, IRichTextConf } from './type';
import { VizRichText } from './viz-rich-text';
import { VizRichTextEditor } from './viz-rich-text-editor';

class VizRichTextMigrator extends VersionBasedMigrator {
  readonly VERSION = 1;

  fixMalformedConfig(config: $TSFixMe): $TSFixMe {
    return defaults({}, config, DEFAULT_CONFIG);
  }

  configVersions(): void {
    this.version(1, (data: $TSFixMe) => {
      return {
        version: 1,
        config: this.fixMalformedConfig(data),
      };
    });
  }
}

export const RichTextVizComponent: VizComponent = {
  displayName: 'Rich Text',
  displayGroup: 'Others',
  migrator: new VizRichTextMigrator(),
  name: 'richText',
  viewRender: VizRichText,
  configRender: VizRichTextEditor,
  createConfig() {
    return {
      version: 1,
      config: cloneDeep(DEFAULT_CONFIG) as IRichTextConf,
    };
  },
};
