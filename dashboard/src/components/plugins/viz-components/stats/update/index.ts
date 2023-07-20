import { TNumbroFormat } from '~/components/panel/settings/common/numbro-format-selector';
import { VersionBasedMigrator } from '~/components/plugins/plugin-data-migrator';
import { IVizStatsConf } from '../type';
import { AnyObject } from '~/types';
import { ColorConfType, ITemplateVariable } from '~/utils/template';
import { cloneDeep, get, omit, set } from 'lodash';

interface ILegacyStatsConf {
  align: 'center';
  size: string;
  weight: string;
  color: $TSFixMe;
  content: {
    prefix: string;
    data_field: string;
    formatter: TNumbroFormat;
    postfix: string;
  };
}

function updateSchema1(legacyConf: IVizStatsConf | ILegacyStatsConf): AnyObject {
  if ('variables' in legacyConf) {
    return legacyConf as IVizStatsConf;
  }

  const {
    align,
    size,
    weight,
    color,
    content: {
      prefix = '',
      data_field = 'value',
      formatter = {
        output: 'number',
        mantissa: 0,
      },
      postfix = '',
    } = {},
  } = legacyConf as ILegacyStatsConf;

  return {
    align,
    template: `${prefix} \$\{value\} ${postfix}`,
    variables: [
      {
        name: 'value',
        data_field,
        aggregation: { type: 'none', config: {} },
        formatter,
        color,
        weight,
        size,
      },
    ],
  };
}

function updateSchema2(legacyConf: IVizStatsConf & { variables: ITemplateVariable[] }): IVizStatsConf {
  return omit(legacyConf, ['variables']);
}

// align -> horizontal_align
// add vertical_align
function v3(legacyConf: $TSFixMe): IVizStatsConf {
  const { align, ...rest } = legacyConf;
  return {
    horizontal_align: align,
    vertical_align: 'center',
    ...rest,
  };
}

/**
 * used when moving variables from stats to `panel.variables`
 */
function fixVariableType(variable: ITemplateVariable) {
  const cloned = cloneDeep(variable);

  // cast color range to a number array
  const colorRange = get(cloned, 'color.valueRange') as Array<string | number> | undefined;
  if (colorRange !== undefined) {
    set(
      cloned,
      'color.valueRange',
      colorRange.map((v) => Number(v)),
    );
  }
  return cloned;
}

export class VizStatsMigrator extends VersionBasedMigrator {
  readonly VERSION = 2;

  configVersions(): void {
    this.version(1, (data) => {
      // @ts-expect-error data's type
      return { version: 1, config: updateSchema1(data) };
    });
    this.version(2, (data, { panelModel }) => {
      const { config } = data;
      const variables = (config.variables || []) as ITemplateVariable[];
      variables.forEach((v) => {
        if (!panelModel.variables.find((vv) => vv.name === v.name)) {
          panelModel.addVariable(fixVariableType(v));
        }
      });
      return { ...data, version: 2, config: updateSchema2(config) };
    });
    this.version(3, (data) => {
      const { config } = data;
      return { ...data, version: 3, config: v3(config) };
    });
  }
}
