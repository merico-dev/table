import { APIClient } from './request';
import { IRole } from './role.typed';

export const role = {
  list: async (): Promise<IRole[]> => {
    const res: IRole[] = await APIClient.get()('/role/list', {}, {});
    return res;
  },
};
