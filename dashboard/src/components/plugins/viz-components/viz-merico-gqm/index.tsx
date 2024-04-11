import { VizComponent } from '~/types/plugin';
import { VersionBasedMigrator } from '../../plugin-data-migrator';
import { VizMericoGQM } from './viz-merico-gqm';
import { VizMericoGQMEditor } from './viz-merico-gqm-editor';
import { DEFAULT_CONFIG, IMericoGQMConf } from './type';
import { cloneDeep } from 'lodash';
import { translation } from './translation';

class VizMericoGQMMigrator extends VersionBasedMigrator {
  readonly VERSION = 1;

  configVersions(): void {
    this.version(1, (data: any) => {
      return {
        version: 1,
        config: data,
      };
    });
  }
}

export const MericoGQMVizComponent: VizComponent = {
  displayName: 'viz.merico_gqm.viz_name',
  displayGroup: 'chart.groups.merico_suite',
  migrator: new VizMericoGQMMigrator(),
  name: 'mericoGQM',
  viewRender: VizMericoGQM,
  configRender: VizMericoGQMEditor,
  createConfig() {
    return {
      version: 1,
      config: cloneDeep(DEFAULT_CONFIG) as IMericoGQMConf,
    };
  },
  translation,
};
