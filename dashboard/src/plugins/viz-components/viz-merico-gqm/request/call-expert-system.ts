import axios from 'axios';
import _ from 'lodash';
import { AnyObject } from '~/types';
import { IMericoGQMConf } from '../type';

function throwIfNotEmpty(error: unknown, path: string) {
  const message = _.get(error, path, '');
  if (message) {
    throw new Error(message);
  }
}

interface IExpertSystemPayload {
  dashboard: string;
  panel: string;
  data: AnyObject[];
}

interface IExpertSystemReply {
  dashboard: string;
  panel: string;
  actor: string;
  interpretation: {
    json: {
      hint: string;
      message: string;
    };
    html: string;
  };
}

interface IExpertSystemResponse {
  query_id: string;
  submitted: string;
  replied: string;
  replies: Array<IExpertSystemReply>;
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
  async (): Promise<IExpertSystemResponse | undefined> => {
    const { expertSystemURL, path, goal, question } = conf;
    if (!path || !goal || !question) {
      return undefined;
    }

    const payload: IExpertSystemPayload = {
      dashboard: goal,
      panel: question,
      data,
    };

    try {
      const baseURL = expertSystemURL.startsWith('http') ? expertSystemURL : window.location.origin;
      const res = await req(baseURL, `/expert/v3/devtable/${path}`, payload, {});
      return res;
    } catch (error) {
      throwIfNotEmpty(error, 'response.data.detail');
      throwIfNotEmpty(error, 'response.data.error');
      console.error(error);
      throw error;
    }
  };
