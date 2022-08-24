import { VizComponent } from '../../../types/plugin';
import { VersionBasedMigrator } from '../../plugin-data-migrator';
import { VizStatus } from './viz-status';
import { VizStatusPanel } from './viz-status-panel';

class VizStatusMigrator extends VersionBasedMigrator {
  readonly VERSION = 1;

  configVersions(): void {
    this.version(1, (data: any) => ({ version: 1, config: data }));
  }
}

export const StatusVizComponent: VizComponent = {
  displayName: 'Status',
  migrator: new VizStatusMigrator(),
  name: 'status',
  viewRender: VizStatus,
  configRender: VizStatusPanel,
};
