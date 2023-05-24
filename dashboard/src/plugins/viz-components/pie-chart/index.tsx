import { VizComponent } from '~/types/plugin';
import { VersionBasedMigrator } from '~/plugins/plugin-data-migrator';
import { VizPieChart } from './viz-pie-chart';
import { VizPieChartEditor } from './viz-pie-chart-editor';
import { DEFAULT_CONFIG, IPieChartConf } from './type';
import { cloneDeep } from 'lodash';

function v2(legacyConf: $TSFixMe): IPieChartConf {
  const { color_field = '', ...rest } = legacyConf;
  return {
    ...rest,
    color_field,
  };
}

class VizPieChartMigrator extends VersionBasedMigrator {
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
        version: 2,
        config: v2(data.config),
      };
    });
  }
}

export const PieChartVizComponent: VizComponent = {
  displayName: 'Pie Chart',
  displayGroup: 'ECharts-based charts',
  migrator: new VizPieChartMigrator(),
  name: 'pie',
  viewRender: VizPieChart,
  configRender: VizPieChartEditor,
  createConfig() {
    return {
      version: 2,
      config: cloneDeep(DEFAULT_CONFIG) as IPieChartConf,
    };
  },
};
