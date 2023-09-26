import { IAccount, IEditAccountPayload, ILoginResp } from './account.typed';
import { APIClient } from './request';
import { PaginationResponse } from './types';

export const account = {
  login: async (name: string, password: string): Promise<ILoginResp> => {
    const payload = {
      name,
      password,
    };
    const res: ILoginResp = await APIClient.post()('/account/login', payload);
    return res;
  },
  list: async (): Promise<PaginationResponse<IAccount>> => {
    const res = await APIClient.post()('/account/list', {
      filter: {},
      sort: [
        {
          field: 'name',
          order: 'ASC',
        },
      ],
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
    const res = await APIClient.get()('/account/get', {});
    return res;
  },
  /**
   * update current account
   */
  update: async (name: string, email: string): Promise<IAccount> => {
    const payload = {
      name: name.trim(),
      email: email.trim(),
    };
    const res: IAccount = await APIClient.put()('/account/update', payload);
    return res;
  },
  /**
   * change current account's password
   */
  changepassword: async (old_password: string, new_password: string): Promise<IAccount> => {
    const payload = {
      old_password: old_password.trim(),
      new_password: new_password.trim(),
    };
    const res: IAccount = await APIClient.post()('/account/changepassword', payload);
    return res;
  },
  create: async (name: string, email: string, password: string, role_id: string): Promise<IAccount> => {
    const res: IAccount = await APIClient.post()('/account/create', {
      name: name.trim(),
      email: email.trim(),
      password: password.trim(),
      role_id,
    });
    return res;
  },
  edit: async (payload: IEditAccountPayload): Promise<IAccount> => {
    if (!payload.reset_password) {
      payload.new_password = undefined;
    }
    const res: IAccount = await APIClient.put()('/account/edit', payload);
    return res;
  },
  delete: async (id: string): Promise<void> => {
    if (!id) {
      return;
    }
    return APIClient.post()('/account/delete', { id });
  },
};
