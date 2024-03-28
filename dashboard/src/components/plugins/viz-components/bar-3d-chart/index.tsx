import { VizComponent } from '~/types/plugin';
import { IMigrationEnv, VersionBasedMigrator } from '~/components/plugins/plugin-data-migrator';
import { VizBar3dChart } from './viz-bar-3d-chart';
import { VizBar3dChartEditor } from './viz-bar-3d-chart-editor';
import { DEFAULT_CONFIG, IBar3dChartConf } from './type';
import { cloneDeep } from 'lodash';

function v2(legacyConf: any, { panelModel }: IMigrationEnv): IBar3dChartConf {
  try {
    const queryID = panelModel.queryIDs[0];
    if (!queryID) {
      throw new Error('cannot migrate when queryID is empty');
    }
    const changeKey = (key: string) => (key ? `${queryID}.${key}` : key);
    const { x_axis_data_key, y_axis_data_key, z_axis_data_key, ...rest } = legacyConf;
    return {
      ...rest,
      x_axis_data_key: changeKey(x_axis_data_key),
      y_axis_data_key: changeKey(y_axis_data_key),
      z_axis_data_key: changeKey(z_axis_data_key),
    };
  } catch (error) {
    console.error('[Migration failed]', error);
    throw error;
  }
}

class VizBar3dChartMigrator extends VersionBasedMigrator {
  readonly VERSION = 2;

  configVersions(): void {
    this.version(1, (data: $TSFixMe) => {
      return {
        version: 1,
        config: data,
      };
    });
    this.version(2, (data, env) => {
      const { config } = data;
      return { ...data, version: 2, config: v2(config, env) };
    });
  }
}

export const Bar3dChartVizComponent: VizComponent = {
  displayName: 'Bar Chart (3D)',
  displayGroup: 'chart.groups.echarts_based_charts',
  migrator: new VizBar3dChartMigrator(),
  name: 'bar-3d',
  viewRender: VizBar3dChart,
  configRender: VizBar3dChartEditor,
  createConfig() {
    return {
      version: 2,
      config: cloneDeep(DEFAULT_CONFIG) as IBar3dChartConf,
    };
  },
};
