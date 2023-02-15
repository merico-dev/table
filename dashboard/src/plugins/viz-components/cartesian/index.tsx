import { VizComponent } from '~/types/plugin';
import { VersionBasedMigrator } from '~/plugins/plugin-data-migrator';
import { VizCartesianChart } from './viz-cartesian-chart';
import { VizCartesianPanel } from './viz-cartesian-panel';
import { DEFAULT_CONFIG, ICartesianChartConf } from './type';
import { ClickEchartSeries } from './triggers/click-echart';
import { ITemplateVariable } from '~/utils/template';
import { AnyObject } from '~/types';
import _, { cloneDeep, get, omit } from 'lodash';
import { DEFAULT_X_AXIS_LABEL_FORMATTER } from './panel/x-axis/x-axis-label-formatter/types';
import { DEFAULT_DATA_ZOOM_CONFIG } from './panel/echarts-zooming-field/types';
import { DEFAULT_X_AXIS_LABEL_OVERFLOW } from './panel/x-axis/x-axis-label-overflow/types';
import { random } from 'chroma-js';

function updateSchema2(legacyConf: ICartesianChartConf & { variables: ITemplateVariable[] }): AnyObject {
  const cloned = cloneDeep(omit(legacyConf, 'variables'));
  cloned.stats = omit(cloned.stats, 'variables');
  return cloned;
}

function updateToSchema3(legacyConf: $TSFixMe): ICartesianChartConf {
  const { rotate, formatter = DEFAULT_X_AXIS_LABEL_FORMATTER } = legacyConf.x_axis.axisLabel;
  return {
    ...legacyConf,
    x_axis: {
      ...legacyConf.x_axis,
      axisLabel: {
        rotate,
        formatter,
      },
    },
  };
}

function updateToSchema4(legacyConf: $TSFixMe): ICartesianChartConf {
  const { dataZoom = DEFAULT_DATA_ZOOM_CONFIG, ...rest } = legacyConf;
  return {
    ...rest,
    dataZoom,
  };
}

function v5(legacyConf: $TSFixMe): ICartesianChartConf {
  const patch = {
    x_axis: {
      axisLabel: {
        overflow: DEFAULT_X_AXIS_LABEL_OVERFLOW,
      },
    },
  };
  return _.defaultsDeep(patch, legacyConf);
}

function v6(legacyConf: $TSFixMe): ICartesianChartConf {
  const reference_lines = legacyConf.reference_lines.map((l: AnyObject) => {
    const {
      lineStyle = {
        type: 'dashed',
        width: 1,
        color: random().css(),
      },
      show_in_legend = false,
    } = l;

    return {
      ...l,
      lineStyle,
      show_in_legend,
    };
  });
  return {
    ...legacyConf,
    reference_lines,
  };
}

export class VizCartesianMigrator extends VersionBasedMigrator {
  readonly VERSION = 6;

  configVersions(): void {
    this.version(1, (data: $TSFixMe) => {
      return {
        version: 1,
        config: data,
      };
    });
    this.version(2, (data, { panelModel }) => {
      const { config } = data;
      const variables = (config.variables || []) as ITemplateVariable[];
      variables.forEach((v) => {
        if (!panelModel.variables.find((vv) => vv.name === v.name)) {
          panelModel.addVariable(v);
        }
      });
      const statVariables = (get(config, 'stats.variables') || []) as ITemplateVariable[];
      statVariables.forEach((v) => {
        if (!panelModel.variables.find((vv) => vv.name === v.name)) {
          panelModel.addVariable(v);
        }
      });
      return { ...data, version: 2, config: updateSchema2(config) };
    });
    this.version(3, (data) => {
      return {
        ...data,
        version: 3,
        config: updateToSchema3(data.config),
      };
    });
    this.version(4, (data) => {
      return {
        ...data,
        version: 4,
        config: updateToSchema4(data.config),
      };
    });
    this.version(5, (data) => {
      return {
        ...data,
        version: 5,
        config: v5(data.config),
      };
    });
    this.version(6, (data) => {
      return {
        ...data,
        version: 6,
        config: v6(data.config),
      };
    });
  }
}

export const CartesianVizComponent: VizComponent = {
  displayName: 'Cartesian Chart',
  migrator: new VizCartesianMigrator(),
  name: 'cartesian',
  viewRender: VizCartesianChart,
  configRender: VizCartesianPanel,
  createConfig() {
    return {
      version: 6,
      config: cloneDeep(DEFAULT_CONFIG) as ICartesianChartConf,
    };
  },
  triggers: [ClickEchartSeries],
};
