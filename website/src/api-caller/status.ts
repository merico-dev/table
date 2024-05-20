import { get } from './request';
import { VersionResp } from './status.typs';

export const StatusAPI = {
  /**
   * get api version
   */
  version: async (signal?: AbortSignal): Promise<VersionResp> => {
    const res = await get(signal)('/version', {});
    return res;
  },
};

export const status = StatusAPI;
