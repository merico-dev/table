import { VersionBasedMigrator } from '~/components/plugins/plugin-data-migrator';

// function v2(prev: AnyObject): IVizLinearGaugeConf {
//   return prev;
// }

export class VizMericoLinearGaugeMigrator extends VersionBasedMigrator {
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
  readonly VERSION = 1;
}
