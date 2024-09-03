import { VizComponent } from '~/types/plugin';
import { IMigrationEnv, VersionBasedMigrator } from '~/components/plugins/plugin-data-migrator';
import { VizPieChart } from './viz-pie-chart';
import { VizPieChartEditor } from './viz-pie-chart-editor';
import { DEFAULT_CONFIG, IPieChartConf } from './type';
import { cloneDeep } from 'lodash';
import { ClickPieChart } from './triggers';
import { translation } from './translation';

function v2(legacyConf: $TSFixMe): IPieChartConf {
  const { color_field = '', ...rest } = legacyConf;
  return {
    ...rest,
    color_field,
  };
}

function v3(legacyConf: any, { panelModel }: IMigrationEnv): IPieChartConf {
  try {
    const queryID = panelModel.queryIDs[0];
    if (!queryID) {
      throw new Error('cannot migrate when queryID is empty');
    }
    const changeKey = (key: string) => (key ? `${queryID}.${key}` : key);
    const { label_field, value_field, color_field } = legacyConf;
    return {
      label_field: changeKey(label_field),
      value_field: changeKey(value_field),
      color_field: changeKey(color_field),
    } as any;
  } catch (error) {
    console.error('[Migration failed]', error);
    throw error;
  }
}
function v4(legacyConf: any): IPieChartConf {
  const { radius = ['50%', '80%'], ...rest } = legacyConf;
  return {
    ...rest,
    radius,
  };
}

class VizPieChartMigrator extends VersionBasedMigrator {
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
    this.version(3, (data, env) => {
      return {
        ...data,
        version: 3,
        config: v3(data.config, env),
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
  readonly VERSION = 4;
}

export const PieChartVizComponent: VizComponent = {
  displayName: 'viz.pie_chart.viz_name',
  displayGroup: 'chart.groups.echarts_based_charts',
  migrator: new VizPieChartMigrator(),
  name: 'pie',
  viewRender: VizPieChart,
  configRender: VizPieChartEditor,
  createConfig() {
    return {
      version: 4,
      config: cloneDeep(DEFAULT_CONFIG) as IPieChartConf,
    };
  },
  triggers: [ClickPieChart],
  translation,
};
