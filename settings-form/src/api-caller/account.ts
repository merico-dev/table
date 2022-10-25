import { IAccount, IEditAccountPayload, ILoginResp } from './account.typed';
import { APIClient } from './request';
import { PaginationResponse } from './types';

export const account = {
  login: async (name: string, password: string): Promise<ILoginResp> => {
    const payload = {
      name,
      password,
    };
    const res: ILoginResp = await APIClient.getRequest('POST')('/account/login', payload);
    return res;
  },
  list: async (): Promise<PaginationResponse<IAccount>> => {
    const res = await APIClient.getRequest('POST')('/account/list', {
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
    const res = await APIClient.getRequest('GET')('/account/get', {});
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
    const res: IAccount = await APIClient.getRequest('PUT')('/account/update', payload);
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
    const res: IAccount = await APIClient.getRequest('POST')('/account/changepassword', payload);
    return res;
  },
  create: async (name: string, email: string, password: string, role_id: number): Promise<IAccount> => {
    const res: IAccount = await APIClient.getRequest('POST')('/account/create', {
      name,
      email,
      password,
      role_id,
    });
    return res;
  },
  edit: async (payload: IEditAccountPayload): Promise<IAccount> => {
    const res: IAccount = await APIClient.getRequest('PUT')('/account/edit', payload);
    return res;
  },
  delete: async (id: string): Promise<void> => {
    if (!id) {
      return;
    }
    return APIClient.getRequest('POST')('/account/delete', { id });
  },
};
