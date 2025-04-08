import { VizComponent } from '~/types/plugin';
import { IMigrationEnv, VersionBasedMigrator } from '~/components/plugins/plugin-data-migrator';
import { VizPieChart } from './viz-pie-chart';
import { VizPieChartEditor } from './viz-pie-chart-editor';
import { DEFAULT_CONFIG, IPieChartConf } from './type';
import { cloneDeep } from 'lodash';
import { ClickPieChart } from './triggers';
import { translation } from './translation';
import * as Migrators from './migrators';

class VizPieChartMigrator extends VersionBasedMigrator {
  configVersions(): void {
    this.version(1, (data) => {
      return {
        version: 1,
        config: data,
      };
    });
    this.version(2, (data) => {
      return {
        ...data,
        version: 2,
        config: Migrators.v2(data.config),
      };
    });
    this.version(3, (data, env) => {
      return {
        ...data,
        version: 3,
        config: Migrators.v3(data.config, env),
      };
    });
    this.version(4, (data) => {
      return {
        ...data,
        version: 4,
        config: Migrators.v4(data.config),
      };
    });
    this.version(5, (data) => {
      return {
        ...data,
        version: 5,
        config: Migrators.v5(data.config),
      };
    });
    this.version(6, (data) => {
      return {
        ...data,
        version: 6,
        config: Migrators.v6(data.config),
      };
    });
    this.version(7, (data) => {
      return {
        ...data,
        version: 7,
        config: Migrators.v7(data.config),
      };
    });
  }
  readonly VERSION = 7;
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
      version: 7,
      config: cloneDeep(DEFAULT_CONFIG) as IPieChartConf,
    };
  },
  triggers: [ClickPieChart],
  translation,
};
