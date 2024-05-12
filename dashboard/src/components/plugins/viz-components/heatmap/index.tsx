import { VizComponent } from '~/types/plugin';
import { IMigrationEnv, VersionBasedMigrator } from '../../plugin-data-migrator';
import { VizHeatmap } from './viz-heatmap';
import { VizHeatmapEditor } from './viz-heatmap-editor';
import { DEFAULT_CONFIG, IHeatmapConf } from './type';
import { ClickHeatBlock } from './triggers';
import _ from 'lodash';
import { translation } from './translation';
import * as Migrators from './migrators';

class VizHeatmapMigrator extends VersionBasedMigrator {
  readonly VERSION = 5;

  configVersions(): void {
    this.version(1, (data: any) => {
      console.log('🟥 unexpected calling');
      return {
        version: 1,
        config: data,
      };
    });
    this.version(2, (data, env) => {
      return {
        ...data,
        version: 2,
        config: Migrators.v2(data.config, env),
      };
    });
    this.version(3, (data) => {
      return {
        ...data,
        version: 3,
        config: Migrators.v3(data.config),
      };
    });
    this.version(4, (data) => {
      return {
        ...data,
        version: 4,
        config: Migrators.v4(data.config),
      };
    });
    this.version(5, (data) => {
      return {
        ...data,
        version: 5,
        config: Migrators.v5(data.config),
      };
    });
  }
}

export const HeatmapVizComponent: VizComponent = {
  displayName: 'viz.heatmap.viz_name',
  displayGroup: 'chart.groups.echarts_based_charts',
  migrator: new VizHeatmapMigrator(),
  name: 'heatmap',
  viewRender: VizHeatmap,
  configRender: VizHeatmapEditor,
  createConfig: (): {
    version: number;
    config: IHeatmapConf;
  } => ({
    version: 5,
    config: DEFAULT_CONFIG,
  }),
  triggers: [ClickHeatBlock],
  translation,
};
