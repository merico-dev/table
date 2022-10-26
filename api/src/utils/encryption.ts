import path from 'path';
import CryptoJS from 'crypto-js';
import _ from 'lodash';
import DataSource from '../models/datasource';
import { DataSourceConfig } from '../api_models/datasource';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const secretKey = process.env.SECRET_KEY ?? '';

export function maybeEncryptPassword(config: DataSourceConfig): void {
  if (_.has(config, 'password')) {
    config.password = CryptoJS.AES.encrypt(config.password, secretKey).toString();
  }
}

export function maybeDecryptPassword(source: DataSource): void {
  if (_.has(source.config, 'password')) {
    source.config.password = CryptoJS.AES.decrypt(source.config.password, secretKey).toString(CryptoJS.enc.Utf8);
  }
}