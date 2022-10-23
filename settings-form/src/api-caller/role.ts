import { post } from '../../../website/src/api-caller/request';
import { PaginationResponse } from '../../../website/src/api-caller/types';
import { IRole } from './role.typed';

export const role = {
  list: async (): Promise<PaginationResponse<IRole>> => {
    const res = await post('/role/list', {});
    return res;
  },
};
