import { TPayloadForSQLSnippet } from '~/model';
import { AnyObject } from '~/types';
import { formatSQL } from '~/utils/sql';

export function formatSQLSnippet(list: AnyObject[], idKey: string, valueKey: string, params: TPayloadForSQLSnippet) {
  return list.reduce((ret, curr) => {
    try {
      ret[curr[idKey]] = formatSQL(curr[valueKey], params);
    } catch (error) {
      ret[curr[idKey]] = (error as any).message;
    }
    return ret;
  }, {} as Record<string, string>);
}
