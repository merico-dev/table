import axios, { AxiosRequestConfig } from 'axios'
import { HttpParams } from '../api_models/query';

export const APIClient = {
  request(method: string) {
    return (url: string, options: HttpParams) => {
      const headers = {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json',
        ...options.headers,
      };

      const conf: AxiosRequestConfig = {
        method,
        url,
        params: options.url_postfix,
        headers: headers,
      };

      if (method !== 'GET') {
        conf.data = JSON.stringify(options.data);
      }
      return axios(conf)
        .then((res: any) => {
          return res.data;
        })
        .catch((err: any) => {
          return Promise.reject(err);
        })
    }
  },
}