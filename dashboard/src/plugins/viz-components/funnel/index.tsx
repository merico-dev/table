import { AnyObject } from '~/types';
import { VizComponent } from '../../../types/plugin';
import { VersionBasedMigrator } from '../../plugin-data-migrator';
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

class VizFunnelMigrator extends VersionBasedMigrator {
  readonly VERSION = 2;

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
  createConfig: (): ConfigType => ({ version: 2, config: DEFAULT_CONFIG }),
};
