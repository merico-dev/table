import { VizComponent } from '~/types/plugin';
import { IMigrationEnv, VersionBasedMigrator } from '../../plugin-data-migrator';
import { DEFAULT_CONFIG, IMericoEstimationChartConf } from './type';
import { VizMericoEstimationChart } from './viz-merico-estimation-chart';
import { VizMericoEstimationChartEditor } from './viz-merico-estimation-chart-editor';
import { translation } from './translation';
import { IEchartsTooltipMetric } from '../../common-echarts-fields/tooltip-metric';
import { getDefaultSeriesUnit } from '../../common-echarts-fields/series-unit';

function v2(legacyConf: any, { panelModel }: IMigrationEnv): IMericoEstimationChartConf {
  try {
    const queryID = panelModel.queryIDs[0];
    if (!queryID) {
      throw new Error('cannot migrate when queryID is empty');
    }
    const changeKey = (key: string) => (key ? `${queryID}.${key}` : key);
    const { x_axis, deviation, metrics, ...rest } = legacyConf;
    return {
      ...rest,
      x_axis: {
        ...x_axis,
        data_key: changeKey(x_axis.data_key),
      },
      deviation: {
        ...deviation,
        data_keys: {
          estimated_value: changeKey(deviation.data_keys.estimated_value),
          actual_value: changeKey(deviation.data_keys.actual_value),
        },
      },

      metrics: metrics.map((m: any) => ({
        ...m,
        data_key: changeKey(m.data_key),
      })),
    };
  } catch (error) {
    console.error('[Migration failed]', error);
    throw error;
  }
}
export function v3(legacyConf: any): IMericoEstimationChartConf {
  const metrics = legacyConf.metrics as IEchartsTooltipMetric[];
  return {
    ...legacyConf,
    metrics: metrics.map((m) => ({
      ...m,
      unit: m.unit ?? getDefaultSeriesUnit(),
    })),
  };
}

class VizMericoEstimationChartMigrator extends VersionBasedMigrator {
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
      return { ...data, version: 2, config: v2(config, env) };
    });
    this.version(3, (data) => {
      const { config } = data;
      return { ...data, version: 3, config: v3(config) };
    });
  }
}

type ConfigType = {
  version: number;
  config: IMericoEstimationChartConf;
};

export const MericoEstimationChartVizComponent: VizComponent = {
  displayName: 'viz.merico_estimation_chart.viz_name',
  displayGroup: 'chart.groups.merico_suite',
  migrator: new VizMericoEstimationChartMigrator(),
  name: 'mericoEstimationChart',
  viewRender: VizMericoEstimationChart,
  configRender: VizMericoEstimationChartEditor,
  createConfig: (): ConfigType => ({ version: 3, config: DEFAULT_CONFIG }),
  translation,
};
