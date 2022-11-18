import axios, { Method } from 'axios';
import CryptoJS from 'crypto-js';
import _ from 'lodash';

function marshall(params: Record<string, $TSFixMe>) {
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

function cryptSign(params: Record<string, $TSFixMe>, appsecret: string) {
  let temp = marshall(params);
  temp += '&key=' + appsecret;
  const sign = CryptoJS.MD5(temp).toString();
  return sign.toUpperCase();
}

export const APIClient = {
  baseURL: 'http://localhost:31200',
  app_id: '',
  app_secret: '',
  getAuthentication(params: Record<string, $TSFixMe>) {
    if (!this.app_id || !this.app_secret) {
      return undefined;
    }
    const nonce_str = new Date().getTime().toString();
    return {
      app_id: this.app_id,
      nonce_str,
      sign: cryptSign(
        {
          app_id: this.app_id,
          nonce_str,
          ...params,
        },
        this.app_secret,
      ),
    };
  },
  getRequest(method: Method) {
    return (url: string, data: $TSFixMe, options: $TSFixMe = {}) => {
      const token = window.localStorage.getItem('token');
      const headers = {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': options.string ? 'application/x-www-form-urlencoded' : 'application/json',
        authorization: token ? `bearer ${token}` : '',
        ...options.headers,
      };

      const conf: $TSFixMe = {
        baseURL: this.baseURL,
        method,
        url,
        params: method === 'GET' ? data : options.params,
        headers: headers,
      };

      if (['POST', 'PUT'].includes(method)) {
        conf.data = options.string ? JSON.stringify(data) : data;
        conf.data.authentication = this.getAuthentication(conf.data);
      }

      return axios(conf)
        .then((res: $TSFixMe) => {
          return res.data;
        })
        .catch((err: $TSFixMe) => {
          if (_.has(err, 'response.data.detail.message')) {
            return Promise.reject(new Error(err.response.data.detail.message));
          }
          return Promise.reject(err);
        });
    };
  },
};

export function configureAPIClient(config: ISettingsFormConfig) {
  if (APIClient.baseURL !== config.apiBaseURL) {
    APIClient.baseURL = config.apiBaseURL;
  }
  if (config.app_id) {
    APIClient.app_id = config.app_id;
  }
  if (config.app_secret) {
    APIClient.app_secret = config.app_secret;
  }
}
