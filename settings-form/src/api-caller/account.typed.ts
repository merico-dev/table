export interface IAccount {
  id: string;
  name: string;
  email: string;
  role_id: string;
  create_time: string;
  update_time: string;
}

export interface IEditAccountPayload {
  id: 'string';
  name: 'string';
  email: 'string';
  role_id: string;
  reset_password: boolean;
}

export interface ILoginResp {
  account: IAccount;
  token: string;
}
