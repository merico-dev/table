import * as CryptoJS from 'crypto-js';

import { $TSFixMe } from './types';

export function marshall(params: Record<string, $TSFixMe>) {
  params = params || {};
  const keys = Object.keys(params).sort();
  const kvs = [];
  for (let i = 0; i < keys.length; i++) {
    const k = keys[i];
    if (k != 'authentication' && params[k]) {
      kvs.push(keys[i] + '=' + (typeof params[k] == 'object' ? JSON.stringify(params[k]) : params[k]));
    } else {
      const authKeys = Object.keys(params[k]).sort();
      for (let j = 0; j < authKeys.length; j++) {
        const ak = authKeys[j];
        if (ak != 'sign' && params[k][ak]) {
          kvs.push(
            authKeys[j] + '=' + (typeof params[k][ak] == 'object' ? JSON.stringify(params[k][ak]) : params[k][ak]),
          );
        }
      }
    }
  }
  return kvs.sort().join('&');
}

export function cryptSign(params: Record<string, $TSFixMe>, appsecret: string) {
  let temp = marshall(params);
  temp += '&key=' + appsecret;
  const sign = CryptoJS.MD5(temp).toString();
  return sign.toUpperCase();
}
