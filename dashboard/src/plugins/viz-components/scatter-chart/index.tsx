import { VizComponent } from '../../../types/plugin';
import { VersionBasedMigrator } from '../../plugin-data-migrator';
import { VizScatterChart } from './viz-scatter-chart';
import { VizScatterChartPanel } from './viz-scatter-chart-panel';
import { DEFAULT_CONFIG, IScatterChartConf } from './type';
import { ClickScatterChartSeries } from './triggers';
import { DEFAULT_DATA_ZOOM_CONFIG } from '../cartesian/panel/echarts-zooming-field/types';
import { cloneDeep } from 'lodash';

function updateToSchema3(legacyConf: $TSFixMe): IScatterChartConf {
  const { dataZoom = DEFAULT_DATA_ZOOM_CONFIG, ...rest } = legacyConf;
  return {
    ...rest,
    dataZoom,
  };
}

class VizScatterChartMigrator extends VersionBasedMigrator {
  readonly VERSION = 3;

  configVersions(): void {
    this.version(1, (data: any) => {
      return {
        version: 1,
        config: data,
      };
    });
    this.version(2, (data) => {
      const { tooltip = { metrics: [] }, ...rest } = data.config;
      return {
        ...data,
        version: 2,
        config: {
          ...rest,
          tooltip,
        },
      };
    });
    this.version(3, (data) => {
      return {
        ...data,
        version: 3,
        config: updateToSchema3(data.config),
      };
    });
  }
}

export const ScatterChartVizComponent: VizComponent = {
  displayName: 'Scatter Chart',
  migrator: new VizScatterChartMigrator(),
  name: 'scatterChart',
  viewRender: VizScatterChart,
  configRender: VizScatterChartPanel,
  createConfig() {
    return {
      version: 3,
      config: cloneDeep(DEFAULT_CONFIG) as IScatterChartConf,
    };
  },
  triggers: [ClickScatterChartSeries],
};
