import axios, { Method } from 'axios';

export const APIClient = {
  baseURL: 'http://localhost:31200',
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
      }

      return axios(conf)
        .then((res: $TSFixMe) => {
          return res.data;
        })
        .catch((err: $TSFixMe) => {
          return Promise.reject(err);
        });
    };
  },
};
