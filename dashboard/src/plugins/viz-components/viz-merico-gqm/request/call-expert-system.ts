import axios from 'axios';
import { AnyObject } from '~/types';
import { IMericoGQMConf } from '../type';

interface IExpertSystemPayload {
  dashboard: string;
  panels: Array<{
    name: string;
    data: AnyObject[];
  }>;
}

async function req(baseURL: string, url: string, data: IExpertSystemPayload, options: $TSFixMe = {}) {
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
  conf: IMericoGQMConf;
  data: AnyObject[];
}

export const callExpertSystem =
  ({ conf, data }: ICallExpertSystem) =>
  async () => {
    const { expertSystemURL, goal, question } = conf;
    if (!expertSystemURL || !goal || !question) {
      return {};
    }

    const payload: IExpertSystemPayload = {
      dashboard: goal,
      panels: [
        {
          name: question,
          data,
        },
      ],
    };

    const res = await req(expertSystemURL, '/expert/v2/devtable', payload, {});
    return res;
  };
