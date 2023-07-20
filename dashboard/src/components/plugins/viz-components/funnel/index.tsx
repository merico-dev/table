import { AnyObject } from '~/types';
import { VizComponent } from '../../../../types/plugin';
import { IMigrationEnv, VersionBasedMigrator } from '../../plugin-data-migrator';
import { VizFunnelChart } from './viz-funnel-chart';
import { VizFunnelEditor } from './viz-funnel-editor';
import { DEFAULT_CONFIG, IFunnelConf } from './type';

function v2(prev: AnyObject): IFunnelConf {
  return {
    series: prev.series.map((s: AnyObject) => {
      const { min, minSize, max, maxSize, ...rest } = s;
      return {
        ...rest,
        min: {
          value: min,
          use_data_min: false,
          size: minSize,
        },
        max: {
          value: max,
          use_data_max: false,
          size: maxSize,
        },
      };
    }),
  };
}

function v3(legacyConf: any, { panelModel }: IMigrationEnv): IFunnelConf {
  try {
    const queryID = panelModel.queryIDs[0];
    if (!queryID) {
      throw new Error('cannot migrate when queryID is empty');
    }
    const changeKey = (key: string) => (key ? `${queryID}.${key}` : key);
    const { series, ...rest } = legacyConf;
    return {
      ...rest,
      series: series.map((s: any) => ({
        ...s,
        level_name_data_key: changeKey(s.level_name_data_key),
        level_value_data_key: changeKey(s.level_value_data_key),
      })),
    };
  } catch (error) {
    console.error('[Migration failed]', error);
    throw error;
  }
}

class VizFunnelMigrator extends VersionBasedMigrator {
  readonly VERSION = 3;

  configVersions(): void {
    this.version(1, (data: any) => {
      return {
        version: 1,
        config: data,
      };
    });
    this.version(2, (data) => {
      const { config } = data;
      return {
        ...data,
        version: 2,
        config: v2(config),
      };
    });
    this.version(3, (data, env) => {
      const { config } = data;
      return {
        ...data,
        version: 3,
        config: v3(config, env),
      };
    });
  }
}

type ConfigType = {
  version: number;
  config: IFunnelConf;
};

export const FunnelVizComponent: VizComponent = {
  displayName: 'Funnel Chart',
  displayGroup: 'ECharts-based charts',
  migrator: new VizFunnelMigrator(),
  name: 'funnel',
  viewRender: VizFunnelChart,
  configRender: VizFunnelEditor,
  createConfig: (): ConfigType => ({ version: 3, config: DEFAULT_CONFIG }),
};
