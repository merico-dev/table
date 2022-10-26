import { IAccount } from '@devtable/settings-form';
import _ from 'lodash';
import React from 'react';

const AccountContext = React.createContext<{
  account: IAccount | null;
  loading: boolean;
  canEdit: boolean;
}>({
  account: null,
  loading: false,
  canEdit: false,
});

export const AccountContextProvider = AccountContext.Provider;

export function useAccountContext() {
  const c = React.useContext(AccountContext);
  if (!c.account) {
    throw new Error('Please use AccountContextProvider');
  }
  return c as {
    account: IAccount;
    loading: boolean;
    canEdit: boolean;
  };
}
