import _ from 'lodash';
import { FilterValuesType } from '../model';
import { ContextInfoType } from '../model/context';
import { SQLSnippetModelInstance } from '../model/sql-snippets';

export function explainSQLSnippet(snippet: string, context: ContextInfoType, filterValues: FilterValuesType) {
  const params = getSQLParams(context, [], filterValues);
  const names = Object.keys(params);
  const vals = Object.values(params);
  try {
    return new Function(...names, `return \`${snippet}\`;`)(...vals);
  } catch (error: $TSFixMe) {
    console.error(error);
    return error.message;
  }
}

export function formatSQL(sql: string, params: Record<string, $TSFixMe> = {}) {
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
  filterValues: FilterValuesType,
) {
  const params = { ...context, filters: filterValues };
  const sqlSnippetRecord = sqlSnippets.reduce((ret: Record<string, $TSFixMe>, curr) => {
    ret[curr.key] = formatSQL(curr.value, params);
    return ret;
  }, {});

  // sql snippets might use context, so context must be at a higher priority
  return _.merge({}, sqlSnippetRecord, context, { filters: filterValues });
}

export function explainSQL(
  sql: string,
  context: ContextInfoType,
  sqlSnippets: SQLSnippetModelInstance[],
  filterValues: FilterValuesType,
) {
  try {
    const params = getSQLParams(context, sqlSnippets, filterValues);
    return formatSQL(sql, params);
  } catch (error: $TSFixMe) {
    console.error(error);
    return error.message;
  }
}
