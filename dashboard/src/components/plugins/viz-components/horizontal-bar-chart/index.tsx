import { VizComponent } from '../../../../types/plugin';
import { IMigrationEnv, VersionBasedMigrator } from '../../plugin-data-migrator';
import { DEFAULT_CONFIG, IHorizontalBarChartConf } from './type';
import { VizHorizontalBarChart } from './viz-horizontal-bar-chart';
import { VizHorizontalBarChartEditor } from './viz-horizontal-bar-chart-editor';

function v2(legacyConf: any, { panelModel }: IMigrationEnv): IHorizontalBarChartConf {
  try {
    const queryID = panelModel.queryIDs[0];
    if (!queryID) {
      throw new Error('cannot migrate when queryID is empty');
    }
    const changeKey = (key: string) => (key ? `${queryID}.${key}` : key);
    const { x_axis, y_axis, series, ...rest } = legacyConf;
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
      series: series.map((s: any) => ({
        ...s,
        data_key: changeKey(s.data_key),
        group_by_key: changeKey(s.group_by_key),
      })),
    };
  } catch (error) {
    console.error('[Migration failed]', error);
    throw error;
  }
}

class VizHorizontalBarChartMigrator extends VersionBasedMigrator {
  readonly VERSION = 2;

  configVersions(): void {
    this.version(1, (data: any) => {
      return {
        version: 1,
        config: data,
      };
    });
    this.version(2, (data, env) => {
      const { config } = data;
      return {
        ...data,
        version: 2,
        config: v2(config, env),
      };
    });
  }
}

type ConfigType = {
  version: number;
  config: IHorizontalBarChartConf;
};

export const HorizontalBarChartVizComponent: VizComponent = {
  displayName: 'Horizontal Bar Chart',
  displayGroup: 'ECharts-based charts',
  migrator: new VizHorizontalBarChartMigrator(),
  name: 'horizontalBarChart',
  viewRender: VizHorizontalBarChart,
  configRender: VizHorizontalBarChartEditor,
  createConfig: (): ConfigType => ({ version: 2, config: DEFAULT_CONFIG }),
};
