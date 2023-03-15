import { AnyObject } from '~/types';
import { VizComponent } from '../../../types/plugin';
import { VersionBasedMigrator } from '../../plugin-data-migrator';
import { VizHorizontalBarChart } from './viz-horizontal-bar-chart';
import { VizHorizontalBarChartEditor } from './viz-horizontal-bar-chart-editor';
import { DEFAULT_CONFIG, IHorizontalBarChartConf } from './type';

// function v2(prev: AnyObject): IHorizontalBarChartConf {
//   return prev;
// }

class VizHorizontalBarChartMigrator extends VersionBasedMigrator {
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
  config: IHorizontalBarChartConf;
};

export const HorizontalBarChartVizComponent: VizComponent = {
  displayName: 'HorizontalBarChart',
  displayGroup: 'Others',
  migrator: new VizHorizontalBarChartMigrator(),
  name: 'horizontalBarChart',
  viewRender: VizHorizontalBarChart,
  configRender: VizHorizontalBarChartEditor,
  createConfig: (): ConfigType => ({ version: 1, config: DEFAULT_CONFIG }),
};
