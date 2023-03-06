import { defaultNumbroFormat } from '~/panel/settings/common/numbro-format-selector';
import { VersionBasedMigrator } from '~/plugins/plugin-data-migrator';
import { VizComponent } from '~/types/plugin';
import { DEFAULT_CONFIG, IRadarChartConf, IRadarChartDimension } from './type';
import { VizRadarChart } from './viz-radar-chart';
import { VizRadarChartEditor } from './viz-radar-chart-editor';

// replace withDefaults function in editor
function v2(legacy: $TSFixMe): IRadarChartConf {
  const { dimensions = [], ...rest } = legacy;
  function setDefaults({ name = '', data_key = '', max = 10, formatter = defaultNumbroFormat }: IRadarChartDimension) {
    return {
      name,
      data_key,
      max,
      formatter,
    };
  }
  return {
    ...rest,
    dimensions: dimensions.map(setDefaults),
  };
}

class VizRadarChartMigrator extends VersionBasedMigrator {
  readonly VERSION = 2;

  configVersions(): void {
    this.version(1, (data: $TSFixMe) => {
      return {
        version: 1,
        config: data,
      };
    });
    this.version(2, (data) => {
      const { config } = data;
      return { ...data, version: 2, config: v2(config) };
    });
  }
}

export const RadarChartVizComponent: VizComponent = {
  displayName: 'Radar Chart',
  displayGroup: 'ECharts-based charts',
  migrator: new VizRadarChartMigrator(),
  name: 'radar',
  viewRender: VizRadarChart,
  configRender: VizRadarChartEditor,
  createConfig: (): {
    version: number;
    config: IRadarChartConf;
  } => ({
    version: 2,
    config: DEFAULT_CONFIG,
  }),
};
