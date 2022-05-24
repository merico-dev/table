import { post } from "./request";

function formatSQL(sql: string, context: Record<string, any>) {
  const names = Object.keys(context);
  const vals = Object.values(context);
  return new Function(...names, `return \`${sql}\`;`)(...vals);
};

export const queryBySQL = (sql: string, context: Record<string, any>) => async () => {
  if (!sql) {
    return [];
  }
  const formattedSQL = formatSQL(sql, context);
  if (sql.includes('$')) {
    console.log(formattedSQL);
  }
  const res = await post('/query', { sql: formattedSQL })
  return res;
}