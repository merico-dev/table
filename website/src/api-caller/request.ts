import axios, { Method } from 'axios';
import _ from 'lodash';

const getRequest = (method: Method, signal?: AbortSignal) => {
  return (url: string, data: $TSFixMe, options: $TSFixMe = {}) => {
    const token = window.localStorage.getItem('token');
    const headers = {
      'X-Requested-With': 'XMLHttpRequest',
      'Content-Type': options.string ? 'application/x-www-form-urlencoded' : 'application/json',
      authorization: token ? `bearer ${token}` : '',
      ...options.headers,
    };

    const conf: $TSFixMe = {
      baseURL: import.meta.env.VITE_API_BASE_URL,
      method,
      url,
      params: method === 'GET' ? data : options.params,
      headers: headers,
      signal,
    };

    if (['POST', 'PUT'].includes(method)) {
      conf.data = options.string ? JSON.stringify(data) : data;
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
};

export const get = (signal?: AbortSignal) => getRequest('GET', signal);
export const post = (signal?: AbortSignal) => getRequest('POST', signal);
export const put = (signal?: AbortSignal) => getRequest('PUT', signal);
