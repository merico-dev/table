import _ from 'lodash';
import { FilterValuesContextType } from '../contexts';
import { ContextInfoType } from '../model/context';
import { SQLSnippetModelInstance } from '../model/sql-snippets';

export function explainSQLSnippet(snippet: string, context: ContextInfoType) {
  const names = Object.keys(context);
  const vals = Object.values(context);
  try {
    return new Function(...names, `return \`${snippet}\`;`)(...vals);
  } catch (error: any) {
    console.error(error);
    return error.message;
  }
}

export function formatSQL(sql: string, params: Record<string, any>) {
  const names = Object.keys(params);
  const vals = Object.values(params);
  try {
    return new Function(...names, `return \`${sql}\`;`)(...vals);
  } catch (error) {
    if (names.length === 0 && sql.includes('$')) {
      throw new Error('[formatSQL] insufficient params');
    }
    throw error;
  }
}

export function getSQLParams(
  context: ContextInfoType,
  sqlSnippets: SQLSnippetModelInstance[],
  filterValues: FilterValuesContextType,
) {
  const sqlSnippetRecord = sqlSnippets.reduce((ret: Record<string, any>, curr) => {
    ret[curr.key] = formatSQL(curr.value, context);
    return ret;
  }, {});

  // sql snippets might use context, so context must be at a higher priority
  return _.merge({}, sqlSnippetRecord, context, { filters: filterValues });
}

export function explainSQL(
  sql: string,
  context: ContextInfoType,
  sqlSnippets: SQLSnippetModelInstance[],
  filterValues: FilterValuesContextType,
) {
  try {
    const params = getSQLParams(context, sqlSnippets, filterValues);
    return formatSQL(sql, params);
  } catch (error: any) {
    console.error(error);
    return error.message;
  }
}
