import path from 'path';
import fs from 'fs-extra';

export const sqlRewriter = (
  fs.existsSync(path.resolve(__dirname, './sqlrewriter.js'))
    ? require(path.resolve(__dirname, './sqlrewriter.js'))
    : {
        default: async (sql, env) => {
          return {
            sql,
          };
        },
      }
).default;
