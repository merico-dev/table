import { VizComponent } from '~/types/plugin';
import { IMigrationEnv, VersionBasedMigrator } from '~/plugins/plugin-data-migrator';
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

function v5(legacyConf: any, { panelModel }: IMigrationEnv): ISunburstConf {
  try {
    const queryID = panelModel.queryIDs[0];
    if (!queryID) {
      throw new Error('cannot migrate when queryID is empty');
    }
    const changeKey = (key: string) => (key ? `${queryID}.${key}` : key);
    const { label_key, value_key, group_key, ...rest } = legacyConf;
    return {
      ...rest,
      label_key: changeKey(label_key),
      value_key: changeKey(value_key),
      group_key: changeKey(group_key),
    };
  } catch (error) {
    console.error('[Migration failed]', error);
    throw error;
  }
}

class VizSunburstMigrator extends VersionBasedMigrator {
  readonly VERSION = 5;

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
    this.version(5, (data, env) => {
      return {
        ...data,
        version: 5,
        config: v5(data.config, env),
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
      version: 5,
      config: cloneDeep(DEFAULT_CONFIG) as ISunburstConf,
    };
  },
};
