import { APIClient } from './request';
import { IRole } from './role.typed';

export const role = {
  list: async (): Promise<IRole[]> => {
    const res: IRole[] = await APIClient.getRequest('GET')('/role/list', {});
    return res;
  },
};
