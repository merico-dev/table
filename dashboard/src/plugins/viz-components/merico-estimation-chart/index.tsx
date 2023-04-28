import { AnyObject } from '~/types';
import { VizComponent } from '../../../types/plugin';
import { VersionBasedMigrator } from '../../plugin-data-migrator';
import { VizMericoEstimationChart } from './viz-merico-estimation-chart';
import { VizMericoEstimationChartEditor } from './viz-merico-estimation-chart-editor';
import { DEFAULT_CONFIG, IMericoEstimationChartConf } from './type';

// function v2(prev: AnyObject): IMericoEstimationChartConf {
//   return prev;
// }

class VizMericoEstimationChartMigrator extends VersionBasedMigrator {
  readonly VERSION = 1;

  configVersions(): void {
    this.version(1, (data: any) => {
      return {
        version: 1,
        config: data,
      };
    });
    //     this.version(2, (data) => {
    //       const { config } = data;
    //       return {
    //         ...data,
    //         version: 2,
    //         config: v2(config),
    //       };
    //     });
  }
}

type ConfigType = {
  version: number;
  config: IMericoEstimationChartConf;
};

export const MericoEstimationChartVizComponent: VizComponent = {
  displayName: 'Merico Estimation Chart',
  displayGroup: 'Merico suite',
  migrator: new VizMericoEstimationChartMigrator(),
  name: 'mericoEstimationChart',
  viewRender: VizMericoEstimationChart,
  configRender: VizMericoEstimationChartEditor,
  createConfig: (): ConfigType => ({ version: 1, config: DEFAULT_CONFIG }),
};
