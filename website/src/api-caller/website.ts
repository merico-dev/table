import { get } from './request';

export type WebsiteGetAllRespType = {
  WEBSITE_LOGO_URL_ZH?: string;
  WEBSITE_LOGO_URL_EN?: string;
  WEBSITE_LOGO_JUMP_URL?: string;
  WEBSITE_FAVICON_URL?: string;
};

export const WebsiteAPI = {
  getAll: async (): Promise<WebsiteGetAllRespType> => {
    const res: WebsiteGetAllRespType = await get('/website/get_all', {});
    return res;
  },
};
