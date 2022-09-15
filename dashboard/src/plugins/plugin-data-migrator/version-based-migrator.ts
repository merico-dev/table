import { get } from 'lodash';
import { IVizComponentMigrator, VizComponentMigrationContext } from '~/types/plugin';
import { PluginDataMigrator } from './plugin-data-migrator';

/**
 * Instance version is read from the `instanceData.version` field.
 * Current version is read from the `VERSION` field.
 * If the instance version is less than the current version,
 * the migrator will run.
 * You can implement the `configVersions` method to
 * specify how migrations are performed.
 */
export abstract class VersionBasedMigrator extends PluginDataMigrator implements IVizComponentMigrator {
  public abstract readonly VERSION: number;

  public abstract configVersions(): void;
  constructor() {
    super();
    this.configVersions();
  }

  override version(version: number, handler: (data: $TSFixMe) => $TSFixMe): PluginDataMigrator {
    return super.version(version, (data) => ({ version, ...handler(data) }));
  }

  async migrate({ instanceData }: VizComponentMigrationContext): Promise<void> {
    const data = await instanceData.getItem(null);
    const instanceVersion = get(data, 'version', 0);
    const updated = this.run({ from: instanceVersion, to: this.VERSION }, data);
    await instanceData.setItem(null, updated);
  }

  async needMigration({ instanceData }: VizComponentMigrationContext): Promise<boolean> {
    const data = await instanceData.getItem(null);
    const instanceVersion = get(data, 'version', 0);
    return instanceVersion < this.VERSION;
  }
}
