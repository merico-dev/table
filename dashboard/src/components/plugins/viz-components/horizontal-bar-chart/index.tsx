import { VizComponent } from '~/types/plugin';
import { IMigrationEnv, VersionBasedMigrator } from '../../plugin-data-migrator';
import { DEFAULT_CONFIG, IHorizontalBarChartConf } from './type';
import { VizHorizontalBarChart } from './viz-horizontal-bar-chart';
import { VizHorizontalBarChartEditor } from './viz-horizontal-bar-chart-editor';
import { translation } from './translation';
import { ClickHorizontalBarChartSeries } from './triggers';
import { getDefaultSeriesUnit } from '../../common-echarts-fields/series-unit';
import _ from 'lodash';

function v2(legacyConf: any, { panelModel }: IMigrationEnv): IHorizontalBarChartConf {
  try {
    const queryID = panelModel.queryIDs[0];
    if (!queryID) {
      throw new Error('cannot migrate when queryID is empty');
    }
    const changeKey = (key: string) => (!!key && !key.includes(`${queryID}.`) ? `${queryID}.${key}` : key);
    const { x_axes, y_axis, series, ...rest } = legacyConf;
    return {
      ...rest,
      x_axes: x_axes.map((x_axis: any) => ({
        ...x_axis,
        data_key: changeKey(x_axis.data_key),
      })),
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
function v3(legacyConf: any): IHorizontalBarChartConf {
  const newSeries = legacyConf.series.map((s: any) => ({
    ...s,
    unit: s.unit ?? getDefaultSeriesUnit(),
  }));
  return {
    ...legacyConf,
    series: newSeries,
  };
}

class VizHorizontalBarChartMigrator extends VersionBasedMigrator {
  readonly VERSION = 3;

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
    this.version(3, (data) => {
      const { config } = data;
      return {
        ...data,
        version: 3,
        config: v3(config),
      };
    });
  }
}

type ConfigType = {
  version: number;
  config: IHorizontalBarChartConf;
};

export const HorizontalBarChartVizComponent: VizComponent = {
  displayName: 'viz.horizontal_bar_chart.viz_name',
  displayGroup: 'chart.groups.echarts_based_charts',
  migrator: new VizHorizontalBarChartMigrator(),
  name: 'horizontalBarChart',
  viewRender: VizHorizontalBarChart,
  configRender: VizHorizontalBarChartEditor,
  createConfig: (): ConfigType => ({ version: 3, config: _.cloneDeep(DEFAULT_CONFIG) as IHorizontalBarChartConf }),
  triggers: [ClickHorizontalBarChartSeries],
  translation,
};
