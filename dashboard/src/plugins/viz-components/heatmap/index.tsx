import { VizComponent } from '../../../types/plugin';
import { IMigrationEnv, VersionBasedMigrator } from '../../plugin-data-migrator';
import { VizHeatmap } from './viz-heatmap';
import { VizHeatmapEditor } from './viz-heatmap-editor';
import { DEFAULT_CONFIG, IHeatmapConf } from './type';
import { ClickHeatBlock } from './triggers';
import _ from 'lodash';

function v2(legacyConf: any, { panelModel }: IMigrationEnv): IHeatmapConf {
  try {
    const queryID = panelModel.queryIDs[0];
    if (!queryID) {
      throw new Error('cannot migrate when queryID is empty');
    }
    const changeKey = (key: string) => (key ? `${queryID}.${key}` : key);
    const { x_axis, y_axis, heat_block, tooltip, ...rest } = legacyConf;
    return {
      ...rest,
      x_axis: {
        ...x_axis,
        data_key: changeKey(x_axis.data_key),
      },
      y_axis: {
        ...y_axis,
        data_key: changeKey(y_axis.data_key),
      },
      heat_block: {
        ...heat_block,
        data_key: changeKey(heat_block.data_key),
      },
      tooltip: {
        ...tooltip,
        metrics: tooltip.metrics.map((m: any) => ({
          ...m,
          data_key: changeKey(m.data_key),
        })),
      },
    };
  } catch (error) {
    console.error('[Migration failed]', error);
    throw error;
  }
}

function v3(legacyConf: any): IHeatmapConf {
  return _.defaultsDeep({}, legacyConf, { heat_block: { label: { show: false, fontSize: 10 } } });
}

class VizHeatmapMigrator extends VersionBasedMigrator {
  readonly VERSION = 3;

  configVersions(): void {
    this.version(1, (data: any) => {
      console.log('🟥 unexpected calling');
      return {
        version: 1,
        config: data,
      };
    });
    this.version(2, (data, env) => {
      return {
        ...data,
        version: 2,
        config: v2(data.config, env),
      };
    });
    this.version(3, (data) => {
      return {
        ...data,
        version: 3,
        config: v3(data.config),
      };
    });
  }
}

export const HeatmapVizComponent: VizComponent = {
  displayName: 'Heatmap',
  displayGroup: 'ECharts-based charts',
  migrator: new VizHeatmapMigrator(),
  name: 'heatmap',
  viewRender: VizHeatmap,
  configRender: VizHeatmapEditor,
  createConfig: (): {
    version: number;
    config: IHeatmapConf;
  } => ({
    version: 3,
    config: DEFAULT_CONFIG,
  }),
  triggers: [ClickHeatBlock],
};
