import axios, { Method } from 'axios'

const getRequest = (method: Method) => {
  return (url: string, data: any, options: any = {}) => {
    const headers = {
      'X-Requested-With': 'XMLHttpRequest',
      'Content-Type': options.string
        ? 'application/x-www-form-urlencoded'
        : 'application/json',
      ...options.headers,
    };

    const conf: any = {
      baseURL: 'http://localhost:31200',
      method,
      url,
      params: method === 'GET' ? data : options.params,
      headers : headers,
    };

    if (method === 'POST') {
      conf.data = options.string ? JSON.stringify(data) : data;
    }

    return axios(conf)
      .then((res: any) => {
        return res.data
      })
      .catch((err: any) => {
        return Promise.reject(err)
      })
  }
}

export const get = getRequest('GET')

export const post = getRequest('POST')
