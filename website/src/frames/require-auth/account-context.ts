import { IAccount } from '@devtable/settings-form';
import React from 'react';

const AccountContext = React.createContext<{
  account: IAccount | null;
  loading: boolean;
  canEdit: boolean;
  isAdmin: boolean;
}>({
  account: null,
  loading: false,
  canEdit: false,
  isAdmin: false,
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
    isAdmin: boolean;
  };
}
