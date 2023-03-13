import { post } from './request';

export type WebsiteSettingsType = {
  WEBSITE_LOGO_URL_ZH?: string;
  WEBSITE_LOGO_URL_EN?: string;
  WEBSITE_LOGO_JUMP_URL?: string;
  WEBSITE_FAVICON_URL?: string;
};

export type ConfigKeyType = 'lang' | 'website_settings';

export type ConfigRespType = { key: ConfigKeyType; value: string };

export const ConfigAPI = {
  get: async (key: ConfigKeyType): Promise<string> => {
    const res: string = await post('/config/get', {
      key,
    });
    return res;
  },
  getWebsiteSettings: async (): Promise<WebsiteSettingsType> => {
    const res: ConfigRespType = await post('/config/get', {
      key: 'website_settings',
    });
    return JSON.parse(res.value) as WebsiteSettingsType;
  },
};
