import { AnyObject } from '~/types';
import { VersionBasedMigrator } from '../../plugin-data-migrator';
import { VizVizDashboardState } from './render/viz-viz-dashboard-state';
import { VizVizDashboardStateEditor } from './editor/viz-viz-dashboard-state-editor';
import { DEFAULT_CONFIG, IVizDashboardStateConf } from './type';
import { translation } from './translation';
import { VizComponent } from '~/types/plugin';

// function v2(prev: AnyObject): IVizDashboardStateConf {
//   return prev;
// }

class VizVizDashboardStateMigrator extends VersionBasedMigrator {
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
  config: IVizDashboardStateConf;
};

export const VizDashboardStateVizComponent: VizComponent = {
  displayName: 'viz.vizDashboardState.viz_name',
  displayGroup: 'chart.groups.others',
  migrator: new VizVizDashboardStateMigrator(),
  name: 'vizDashboardState',
  viewRender: VizVizDashboardState,
  configRender: VizVizDashboardStateEditor,
  createConfig: (): ConfigType => ({ version: 1, config: DEFAULT_CONFIG }),
  translation,
};
