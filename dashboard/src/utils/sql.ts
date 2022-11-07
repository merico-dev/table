import _ from 'lodash';
import { FilterValuesType } from '../model';
import { ContextInfoType } from '../model/context';
import { SQLSnippetModelInstance } from '../model/sql-snippets';

export function explainSQLSnippet(
  snippet: string,
  context: ContextInfoType,
  mock_context: Record<string, $TSFixMe>,
  filterValues: FilterValuesType,
) {
  const params = getSQLParams(context, mock_context, [], filterValues);
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
  mock_context: Record<string, $TSFixMe>,
  sqlSnippets: SQLSnippetModelInstance[],
  filterValues: FilterValuesType,
) {
  const params = {
    context: {
      ...mock_context,
      ...context,
    },
    filters: filterValues,
  };
  const sqlSnippetRecord = sqlSnippets.reduce((ret: Record<string, $TSFixMe>, curr) => {
    ret[curr.key] = formatSQL(curr.value, params);
    return ret;
  }, {});

  return _.merge({}, { context, filters: filterValues, sql_snippets: sqlSnippetRecord });
}

export function explainSQL(
  sql: string,
  context: ContextInfoType,
  mock_context: Record<string, $TSFixMe>,
  sqlSnippets: SQLSnippetModelInstance[],
  filterValues: FilterValuesType,
) {
  try {
    const params = getSQLParams(context, mock_context, sqlSnippets, filterValues);
    return formatSQL(sql, params);
  } catch (error: $TSFixMe) {
    console.error(error);
    return error.message;
  }
}
