import { get } from '../../../website/src/api-caller/request';
import { IRole } from './role.typed';

export const role = {
  list: async (): Promise<IRole[]> => {
    const res: IRole[] = await get('/role/list', {});
    return res;
  },
};
