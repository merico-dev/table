import { get } from './request';

export const StatusAPI = {
  /**
   * get api version
   */
  version: async (): Promise<string> => {
    const res = await get('/version', {});
    return res;
  },
};
