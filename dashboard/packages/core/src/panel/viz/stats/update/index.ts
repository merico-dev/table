import { TNumbroFormat } from "../../../settings/common/numbro-format-selector";
import { IVizStatsConf } from "../types";

export interface ILegacyStatsConf {
  align: 'center';
  size: string;
  weight: string;
  color: any;
  content: {
    prefix: string;
    data_field: string;
    formatter: TNumbroFormat,
    postfix: string;
  }
}

// TODO: follow plugin system's way of updating viz schema
export function updateSchema(legacyConf: IVizStatsConf | ILegacyStatsConf): IVizStatsConf {
  if ('variables' in legacyConf) {
    return legacyConf as IVizStatsConf;
  }
  console.log(legacyConf, 'variables' in legacyConf)

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
      postfix = ''
    } = {}
  } = legacyConf as ILegacyStatsConf;

  return {
    align,
    template: `${prefix} \$\{value\} ${postfix}`,
    variables: [
      {
        name: 'value',
        data_field,
        formatter,
        color,
        weight,
        size,
      }
    ]
  }
}