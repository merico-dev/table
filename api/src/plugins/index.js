import path from 'path';
import fs from 'fs-extra';

export const sqlRewriter = (
  fs.existsSync(path.resolve(__dirname, './sql_rewriter.js'))
    ? require(path.resolve(__dirname, './sql_rewriter.js'))
    : { default: async (sql, env) => sql }
).default;
