import axios from 'axios';

async function req(baseURL: string, url: string, data: $TSFixMe[], options: $TSFixMe = {}) {
  const headers = {
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': options.string ? 'application/x-www-form-urlencoded' : 'application/json',
    ...options.headers,
  };

  const conf: $TSFixMe = {
    baseURL,
    method: 'POST',
    url,
    params: options.params,
    headers: headers,
  };

  conf.data = options.string ? JSON.stringify(data) : data;

  return axios(conf)
    .then((res: $TSFixMe) => {
      return res.data;
    })
    .catch((err: $TSFixMe) => {
      return Promise.reject(err);
    });
}

interface ICallExpertSystem {
  baseURL?: string;
  payload: $TSFixMe;
}

export const callExpertSystem =
  ({ baseURL, payload }: ICallExpertSystem) =>
  async () => {
    if (!baseURL) {
      return {};
    }
    const res = await req(baseURL, '/expert/v2/scenario', payload, {});
    return res;
  };
