import { IAccount, IEditAccountPayload } from './account.typed';
import { get, post, put } from '../../../website/src/api-caller/request';
import { PaginationResponse } from '../../../website/src/api-caller/types';

export const AccountAPI = {
  /**
   * change current account's password
   */
  login: async (name: string, password: string): Promise<IAccount> => {
    const payload = {
      name,
      password,
    };
    const res: IAccount = await post('/account/login', payload);
    return res;
  },
  list: async (): Promise<PaginationResponse<IAccount>> => {
    const res = await post('/account/list', {
      filter: {
        search: '',
      },
      sort: {
        field: 'name',
        order: 'ASC',
      },
      pagination: {
        page: 1,
        pagesize: 100,
      },
    });
    return res;
  },
  /**
   * get current account
   */
  get: async (): Promise<IAccount> => {
    const res = await get('/account/get', {});
    return res;
  },
  /**
   * update current account
   */
  update: async (name: string, email: string): Promise<IAccount> => {
    const payload = {
      name,
      email,
    };
    const res: IAccount = await put('/account/update', payload);
    return res;
  },
  /**
   * change current account's password
   */
  changepassword: async (old_password: string, new_password: string): Promise<IAccount> => {
    const payload = {
      old_password,
      new_password,
    };
    const res: IAccount = await post('/account/changepassword', payload);
    return res;
  },
  create: async (name: string, email: string, password: string, role_id: number): Promise<IAccount> => {
    const res: IAccount = await post('/account/create', {
      name,
      email,
      password,
      role_id,
    });
    return res;
  },
  edit: async (payload: IEditAccountPayload): Promise<IAccount> => {
    const res: IAccount = await put('/account/edit', payload);
    return res;
  },
  delete: async (id: string): Promise<void> => {
    if (!id) {
      return;
    }
    return await post('/account/delete', { id });
  },
};
