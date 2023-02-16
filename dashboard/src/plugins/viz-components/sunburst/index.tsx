import { VizComponent } from '~/types/plugin';
import { VersionBasedMigrator } from '~/plugins/plugin-data-migrator';
import { DEFAULT_CONFIG, ISunburstConf } from './type';
import { VizSunburst } from './viz-sunburst';
import { VizSunburstEditor } from './viz-sunburst-editor';
import { cloneDeep } from 'lodash';

function v2(legacy: any): ISunburstConf {
  const { label_field, value_field } = legacy;
  return {
    label_key: label_field,
    value_key: value_field,
  };
}

class VizSunburstMigrator extends VersionBasedMigrator {
  readonly VERSION = 2;

  configVersions(): void {
    this.version(1, (data: $TSFixMe) => {
      return {
        version: 1,
        config: data,
      };
    });
    this.version(2, (data) => {
      return {
        ...data,
        version: 1,
        config: v2(data.config),
      };
    });
  }
}

export const SunburstVizComponent: VizComponent = {
  displayName: 'Sunburst',
  migrator: new VizSunburstMigrator(),
  name: 'sunburst',
  viewRender: VizSunburst,
  configRender: VizSunburstEditor,
  createConfig() {
    return {
      version: 2,
      config: cloneDeep(DEFAULT_CONFIG) as ISunburstConf,
    };
  },
};
