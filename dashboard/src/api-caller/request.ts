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
        if (typeof res.data !== 'object') {
          console.error('数据格式响应错误:', res.data)
          alert('前方拥挤，请刷新再试')
          return Promise.reject(res)
        }
        if (res.data.errcode) {
          if (res.data.errcode == 401) {
            window.location.href = 'login' // 登录失效跳转登录页
            return
          }
          // silent 选项，错误不提示
          if (res.data.message && !options.silent)
            alert(res.data.message)
          return Promise.reject(res.data)
        }

        return res.data
      })
      .catch((err: any) => {
        return Promise.reject(err)
      })
  }
}

export const get = getRequest('GET')

export const post = getRequest('POST')
