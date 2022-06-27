import { ContextInfoContextType } from "../contexts";

export function explainSQLSnippet(snippet: string, context: ContextInfoContextType) {
  const names = Object.keys(context);
  const vals = Object.values(context);
  try {
    return new Function(...names, `return \`${snippet}\`;`)(...vals);
  } catch (error: any) {
    console.error(error)
    return error.message;
  }
}