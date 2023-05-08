import { IAccount } from '@devtable/settings-form';
import { get, post, put } from './request';
import { PaginationResponse } from './types';

export const account = {
  list: async (signal?: AbortSignal): Promise<PaginationResponse<IAccount>> => {
    const res = await post(signal)('/account/list', {
      filter: {},
      sort: [
        {
          field: 'name',
          order: 'ASC',
        },
      ],
      pagination: {
        page: 1,
        pagesize: 1000,
      },
    });
    return res;
  },
  /**
   * get current account
   */
  get: async (signal?: AbortSignal): Promise<IAccount> => {
    const res = await get(signal)('/account/get', {});
    return res;
  },
  /**
   * update current account
   */
  update: async (name: string, email: string, signal?: AbortSignal): Promise<IAccount> => {
    const payload = {
      name,
      email,
    };
    const res: IAccount = await put(signal)('/account/update', payload);
    return res;
  },
  /**
   * change current account's password
   */
  changepassword: async (old_password: string, new_password: string, signal?: AbortSignal): Promise<IAccount> => {
    const payload = {
      old_password,
      new_password,
    };
    const res: IAccount = await post(signal)('/account/changepassword', payload);
    return res;
  },
};
