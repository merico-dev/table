import _ from "lodash";
import { ContextInfoContextType } from "../contexts";
import { IDashboardDefinition, IQuery } from "../types";
import { formatSQL, getSQLParams } from "../utils/sql";
import { APIClient } from "./request";

interface IQueryBySQL {
  context: ContextInfoContextType;
  definitions: IDashboardDefinition;
  title: string;
  query?: IQuery;
}

export const queryBySQL = ({ context, definitions, title, query }: IQueryBySQL) => async () => {
  if (!query || !query.sql) {
    return [];
  }
  const { type, key, sql } = query;

  const needParams = sql.includes('$');
  try {
    const params = getSQLParams(context, definitions);
    const formattedSQL = formatSQL(sql, params);
    if (needParams) {
      console.groupCollapsed(`Final SQL for: ${title}`);
      console.log(formattedSQL);
      console.groupEnd();
    }
    const res = await APIClient.getRequest('POST')('/query', { type, key, query: formattedSQL })
    return res;
  } catch (error) {
    console.error(error)
    return [];
  }
}

export type TQuerySources = Record<string, string[]>

export async function listDataSources(): Promise<TQuerySources> {
  try {
    const res = await APIClient.getRequest('POST')('/datasource/list', {})
    return res;
  } catch (error) {
    console.error(error)
    return {};
  }
}