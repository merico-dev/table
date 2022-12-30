import * as crypto from 'crypto';
import { DataSourceOptions } from 'typeorm';
import { DataSourceConfig } from '~/api_models/datasource';
import DataSource from '~/models/datasource';
import { DATABASE_CONNECTION_TIMEOUT_MS } from '~/utils/constants';
import { maybeEncryptPassword, maybeDecryptPassword } from '~/utils/encryption';
import { configureDatabaseSource, cryptSign, escapeLikePattern } from '~/utils/helpers';

describe('Utils', () => {
  describe('encryption', () => {
    it('should encrypt and decrypt succesfully', () => {
      const source: DataSource = {
        config: {
          host: 'test',
          database: 'test',
          password: 'test',
          port: 0,
          username: 'test',
        },
        id: crypto.randomUUID(),
        is_preset: false,
        key: 'test',
        type: 'postgresql',
        create_time: new Date(),
        update_time: new Date(),
      };

      maybeEncryptPassword(source.config);
      expect(source.config).not.toMatchObject({
        host: 'test',
        database: 'test',
        password: 'test',
        port: 0,
        username: 'test',
      });

      maybeDecryptPassword(source);
      expect(source.config).toMatchObject({
        host: 'test',
        database: 'test',
        password: 'test',
        port: 0,
        username: 'test',
      });
    });
  });

  describe('helpers', () => {
    it('configureDatabaseSource', () => {
      const config: DataSourceConfig = {
        host: 'test',
        database: 'test',
        password: 'test',
        port: 0,
        username: 'test',
      };
      const pgresult: DataSourceOptions = configureDatabaseSource('postgresql', config);
      expect(pgresult).toMatchObject({
        host: 'test',
        port: 0,
        username: 'test',
        password: 'test',
        database: 'test',
        type: 'postgres',
        connectTimeoutMS: DATABASE_CONNECTION_TIMEOUT_MS,
      });

      const mysqlresult: DataSourceOptions = configureDatabaseSource('mysql', config);
      expect(mysqlresult).toMatchObject({
        host: 'test',
        port: 0,
        username: 'test',
        password: 'test',
        database: 'test',
        type: 'mysql',
        connectTimeout: DATABASE_CONNECTION_TIMEOUT_MS,
      });
    });

    it('escapeLikePattern', () => {
      const test1 = '';
      const result1 = escapeLikePattern(test1);
      expect(result1).toEqual('');

      const test2 = '%something%';
      const result2 = escapeLikePattern(test2);
      expect(result2).toEqual('\\%something\\%');

      const test3 = '_something_';
      const result3 = escapeLikePattern(test3);
      expect(result3).toEqual('\\_something\\_');

      const test4 = '%_something_%';
      const result4 = escapeLikePattern(test4);
      expect(result4).toEqual('\\%\\_something\\_\\%');
    });

    it('cryptSign', () => {
      const data = {
        a: 1,
        b: 'test',
        c: true,
        d: {
          d1: 'test',
          d2: false,
        },
        e: [1, 'test', true, { e1: 'test', e2: false }],
      };
      const sign = cryptSign(data, 'secret');
      expect(sign).toEqual('86997FD22939C2E98263661164AFCA0F');
    });
  });
});
