import { get } from 'lodash';
import { IVizComponentMigrator, VizComponent, VizComponentMigrationContext } from '../../../types/plugin';
import { PluginDataMigrator } from '../../plugin-data-migrator';
import { VizTable } from './viz-table';
import { VizTablePanel } from './viz-table-panel';

const VERSION = 1;

class VizTableMigrator extends PluginDataMigrator implements IVizComponentMigrator {
  constructor() {
    super();
    this.version(1, (data: any) => {
      return {
        version: 1,
        config: data,
      };
    });
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
    return instanceVersion < VERSION;
  }
}

export const TableVizComponent: VizComponent = {
  displayName: 'Table',
  migrator: new VizTableMigrator(),
  name: 'table',
  viewRender: VizTable,
  configRender: VizTablePanel,
};
