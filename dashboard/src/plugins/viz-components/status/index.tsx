import { get } from 'lodash';
import { IVizComponentMigrator, VizComponent, VizComponentMigrationContext } from '../../../types/plugin';
import { PluginDataMigrator } from '../../plugin-data-migrator';
import { VizStatus } from './viz-status';
import { VizStatusPanel } from './viz-status-panel';

const VERSION = 1;

class VizStatusMigrator extends PluginDataMigrator implements IVizComponentMigrator {
  constructor() {
    super();
    // this.version(1, (data: any) => {
    //   return {
    //     version: 1,
    //     config: data,
    //   };
    // });
  }

  async migrate({ instanceData }: VizComponentMigrationContext): Promise<void> {
    const data = await instanceData.getItem(null);
    const instanceVersion = get(data, 'version', 0);
    const updated = this.run({ from: instanceVersion, to: VERSION }, data);
    await instanceData.setItem(null, updated);
  }

  async needMigration({ instanceData }: VizComponentMigrationContext): Promise<boolean> {
    const data = await instanceData.getItem(null);
    const instanceVersion = get(data, 'version', 0);
    const result = instanceVersion < VERSION;
    console.info(`needMigration: ${result}, from: ${instanceVersion}, to: ${VERSION}`);
    return result;
  }
}

export const StatusVizComponent: VizComponent = {
  displayName: 'Status',
  migrator: new VizStatusMigrator(),
  name: 'status',
  viewRender: VizStatus,
  configRender: VizStatusPanel,
};
