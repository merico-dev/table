import { DefaultApiClient, FacadeApiClient, IAPIClient } from '../shared';

export { FacadeApiClient, DefaultApiClient } from '../shared';
export type { IAPIClient, IAPIClientRequestOptions } from '../shared';

const Default = new DefaultApiClient();

/**
 * @example facadeApiClient.implementation = new MyAPIClient();
 */
export const facadeApiClient = new FacadeApiClient(Default);

export const APIClient: IAPIClient = facadeApiClient;

export function configureAPIClient(config: ISettingsFormConfig) {
  if (Default.baseURL !== config.apiBaseURL) {
    Default.baseURL = config.apiBaseURL;
  }
  if (config.app_id) {
    Default.app_id = config.app_id;
  }
  if (config.app_secret) {
    Default.app_secret = config.app_secret;
  }
}
