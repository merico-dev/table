import _ from 'lodash';
import { AnyObject } from '..';
import { FilterValuesType } from '../model';
import { ContextInfoType } from '../model/context';
import { SQLSnippetModelInstance } from '../model/sql-snippets';
import { functionUtils } from './function-utils';

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
    console.info(error);
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
  real_context: ContextInfoType,
  mock_context: Record<string, $TSFixMe>,
  sqlSnippets: SQLSnippetModelInstance[],
  filterValues: FilterValuesType,
) {
  const context = {
    ...mock_context,
    ...real_context,
  };
  const params = {
    context,
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

export function preProcessSQLQuery({ sql, pre_process }: { sql: string; pre_process: TFunctionString }) {
  if (!pre_process.trim()) {
    return sql;
  }
  try {
    return new Function(`return ${pre_process}`)()({ sql }, functionUtils);
  } catch (error) {
    console.error(error);
    return sql;
  }
}

export function postProcessSQLQuery(post_process: TFunctionString, data: any) {
  if (!post_process.trim()) {
    return data;
  }
  try {
    return new Function(`return ${post_process}`)()(data, functionUtils);
  } catch (error) {
    console.error(error);
    return data;
  }
}
