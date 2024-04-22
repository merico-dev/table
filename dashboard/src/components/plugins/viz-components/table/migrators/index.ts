import { IMigrationEnv } from '~/components/plugins/plugin-data-migrator';
import { ITableConf } from '../type';
import { parseDataKey } from '~/utils';

export function v3(prev: any): ITableConf {
  const { columns, ...rest } = prev;
  return {
    ...prev,
    columns: columns.map((c: any) => ({
      ...c,
      align: c.align ?? 'left',
    })),
  };
}

export function v4(legacyConf: any, { panelModel }: IMigrationEnv): ITableConf {
  try {
    const queryID = panelModel.queryIDs[0];
    if (!queryID) {
      throw new Error('cannot migrate when queryID is empty');
    }
    const changeKey = (key: string) => (key ? `${queryID}.${key}` : key);
    const { id_field, columns, ...rest } = legacyConf;
    return {
      ...rest,
      id_field: changeKey(id_field),

      columns: columns.map((c: any) => ({
        ...c,
        value_field: changeKey(c.value_field),
      })),
    };
  } catch (error) {
    console.error('[Migration failed]', error);
    throw error;
  }
}

export function v5(prev: any): ITableConf {
  const { columns, ...rest } = prev;
  return {
    ...rest,
    columns: columns.map((c: any) => ({
      ...c,
      align: c.align ?? 'left',
      cellBackgroundColor: c.cellBackgroundColor ?? '',
      width: c.width ?? '',
    })),
  };
}

export function v6(prev: any): ITableConf {
  const { id_field, ...rest } = prev;
  const { queryID } = parseDataKey(id_field);
  return {
    ...rest,
    query_id: queryID ?? '',
  };
}
