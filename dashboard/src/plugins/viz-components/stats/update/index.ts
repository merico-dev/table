import { TNumbroFormat } from '~/panel/settings/common/numbro-format-selector';
import { VersionBasedMigrator } from '~/plugins/plugin-data-migrator';
import { IVizStatsConf } from '../type';

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

function updateSchema(legacyConf: IVizStatsConf | ILegacyStatsConf): IVizStatsConf {
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

export class VizStatsMigrator extends VersionBasedMigrator {
  readonly VERSION = 1;

  configVersions(): void {
    this.version(1, (data: $TSFixMe) => {
      return { config: updateSchema(data) };
    });
  }
}
