import { TPayloadForSQL, TPayloadForSQLSnippet } from '~/model';
import { functionUtils } from './function-utils';

export function formatSQL(sql: string, payload: TPayloadForSQL | TPayloadForSQLSnippet) {
  const names = Object.keys(payload);
  const vals = Object.values(payload);
  try {
    return new Function(...names, `return \`${sql}\`;`)(...vals);
  } catch (error) {
    if (names.length === 0 && sql.includes('$')) {
      throw new Error('[formatSQL] insufficient payload');
    }
    throw error;
  }
}

export function explainSQL(sql: string, payload: TPayloadForSQL) {
  try {
    return formatSQL(sql, payload);
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
