import { AnyObject } from '~/types';
import { VizComponent } from '../../../types/plugin';
import { VersionBasedMigrator } from '../../plugin-data-migrator';
import { VizFunnel } from './viz-funnel';
import { VizFunnelEditor } from './viz-funnel-editor';
import { DEFAULT_CONFIG, IFunnelConf } from './type';

// function v2(prev: AnyObject): IFunnelConf {
//   return prev;
// }

class VizFunnelMigrator extends VersionBasedMigrator {
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
  config: IFunnelConf;
};

export const FunnelVizComponent: VizComponent = {
  displayName: 'Funnel Chart',
  displayGroup: 'ECharts-based charts',
  migrator: new VizFunnelMigrator(),
  name: 'funnel',
  viewRender: VizFunnel,
  configRender: VizFunnelEditor,
  createConfig: (): ConfigType => ({ version: 1, config: DEFAULT_CONFIG }),
};
