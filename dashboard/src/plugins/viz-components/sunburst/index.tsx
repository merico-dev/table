import { VizComponent } from '~/types/plugin';
import { VersionBasedMigrator } from '~/plugins/plugin-data-migrator';
import { DEFAULT_CONFIG, ISunburstConf } from './type';
import { VizSunburst } from './viz-sunburst';
import { VizSunburstEditor } from './viz-sunburst-editor';
import { cloneDeep } from 'lodash';

function v2(legacy: any): ISunburstConf {
  const { label_field, value_field, ...rest } = legacy;
  return {
    ...rest,
    label_key: label_field,
    value_key: value_field,
  };
}

function v3(legacy: any): ISunburstConf {
  const { group_key = '', ...rest } = legacy;
  return {
    ...rest,
    group_key,
  };
}

function v4(legacy: any): ISunburstConf {
  const { levels = [], ...rest } = legacy;
  return {
    ...rest,
    levels,
  };
}

class VizSunburstMigrator extends VersionBasedMigrator {
  readonly VERSION = 4;

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
        version: 2,
        config: v2(data.config),
      };
    });
    this.version(3, (data) => {
      return {
        ...data,
        version: 3,
        config: v3(data.config),
      };
    });
    this.version(4, (data) => {
      return {
        ...data,
        version: 4,
        config: v4(data.config),
      };
    });
  }
}

export const SunburstVizComponent: VizComponent = {
  displayName: 'Sunburst Chart',
  displayGroup: 'ECharts-based charts',
  migrator: new VizSunburstMigrator(),
  name: 'sunburst',
  viewRender: VizSunburst,
  configRender: VizSunburstEditor,
  createConfig() {
    return {
      version: 4,
      config: cloneDeep(DEFAULT_CONFIG) as ISunburstConf,
    };
  },
};
