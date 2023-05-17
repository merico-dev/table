import { get } from './request';

export const StatusAPI = {
  /**
   * get api version
   */
  version: async (signal?: AbortSignal): Promise<string> => {
    const res = await get(signal)('/version', {});
    return res;
  },
};

export const status = StatusAPI;
