import _ from "lodash";
import { ContextInfoContextType } from "../contexts";
import { IDashboardDefinition } from "../types";
import { post } from "./request";

function formatSQL(sql: string, params: Record<string, any>) {
  const names = Object.keys(params);
  const vals = Object.values(params);
  console.log({ names, vals })
  return new Function(...names, `return \`${sql}\`;`)(...vals);
};

function getSQLParams(context: ContextInfoContextType, definitions: IDashboardDefinition) {
  const sqlSnippetRecord = definitions.sqlSnippets.reduce((ret: Record<string, any>, curr) => {
    ret[curr.key] = formatSQL(curr.value, context)
    return ret;
  }, {})

  // sql snippets might use context, so context must be at a higher priority
  return _.defaultsDeep(context, sqlSnippetRecord);
}

export const queryBySQL = (sql: string, context: ContextInfoContextType, definitions: IDashboardDefinition) => async () => {
  if (!sql) {
    return [];
  }
  const params = getSQLParams(context, definitions);
  const formattedSQL = formatSQL(sql, params);
  if (sql.includes('$')) {
    console.log(formattedSQL);
  }
  const res = await post('/query', { sql: formattedSQL })
  return res;
}