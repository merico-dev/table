import { VersionBasedMigrator } from '~/components/plugins/plugin-data-migrator';
import { IMericoLinearGaugeConf } from '../type';
import { getDefaultNumberFormat } from '~/utils';

function v2(legacy: any): IMericoLinearGaugeConf {
  const { order = 'asc', format = getDefaultNumberFormat(), ...rest } = legacy;
  return { ...rest, order, format };
}

export class VizMericoLinearGaugeMigrator extends VersionBasedMigrator {
  configVersions(): void {
    this.version(1, (data: any) => {
      return {
        version: 1,
        config: data,
      };
    });
    this.version(2, (data) => {
      const { config } = data;
      return {
        ...data,
        version: 2,
        config: v2(config),
      };
    });
  }
  readonly VERSION = 2;
}
