import { get } from 'lodash';
import { IConfigMigrationContext, IConfigMigrationExecContext, IPanelScopeConfigMigrator } from '~/types/plugin';
import { IMigration, PluginDataMigrator } from './plugin-data-migrator';

/**
 * Instance version is read from the `instanceData.version` field.
 * Current version is read from the `VERSION` field.
 * If the instance version is less than the current version,
 * the migrator will run.
 * You can implement the `configVersions` method to
 * specify how migrations are performed.
 */
export abstract class VersionBasedMigrator extends PluginDataMigrator implements IPanelScopeConfigMigrator {
  public abstract readonly VERSION: number;

  public abstract configVersions(): void;

  constructor() {
    super();
    this.configVersions();
  }

  override version(version: number, handler: IMigration['handler']): PluginDataMigrator {
    return super.version(version, (data, env) => ({ version, ...handler(data, env) }));
  }

  async migrate({ configData, panelModel }: IConfigMigrationExecContext): Promise<void> {
    const data = await configData.getItem(null);
    const instanceVersion = get(data, 'version', 0);
    const updated = this.run({ from: instanceVersion, to: this.VERSION }, data, { panelModel });
    await configData.setItem(null, updated);
  }

  async needMigration({ configData }: IConfigMigrationContext): Promise<boolean> {
    const data = await configData.getItem(null);
    const instanceVersion = get(data, 'version', 0);
    return instanceVersion < this.VERSION;
  }
}
