import axios from 'axios';
import { addDisposer, flow, getParent, toGenerator, types } from 'mobx-state-tree';

import { get } from 'lodash';
import { autorun } from 'mobx';
import { AccountAPI } from '../../../../../api-caller/account';
import { AccountOrAPIKeyOptionType } from '../../../../../api-caller/dashboard-permission.types';
import { PermissionAccessModelInstance } from './permission-access-model';

export const AccountOrAPIKeyOptionsModel = types
  .model({
    list: types.optional(types.frozen<AccountOrAPIKeyOptionType[]>(), []),
    state: types.optional(types.enumeration(['idle', 'loading', 'error']), 'idle'),
    error: types.frozen(),
  })
  .views((self) => ({
    get loading() {
      return self.state === 'loading';
    },
    get choosableOptions() {
      const { access } = getParent(self) as { access: PermissionAccessModelInstance[] };
      const chosenSet = new Set(access.map((a) => `${a.id}--${a.type}`));
      return self.list.map((o) => ({
        ...o,
        disabled: chosenSet.has(`${o.value}--${o.type}`),
      }));
    },
    get allOptionsAreChosen() {
      return this.choosableOptions.every((o) => o.disabled);
    },
  }))

  .volatile(() => ({
    controller: new AbortController(),
  }))
  .actions((self) => {
    return {
      load: flow(function* () {
        self.controller?.abort();
        self.controller = new AbortController();
        self.state = 'loading';
        try {
          const accountResp = yield* toGenerator(AccountAPI.list());
          const accounts = accountResp.data
            .filter((d) => d.role_id <= 40) // exclude superadmin
            .map((d) => ({ label: d.name, value: d.id, type: 'ACCOUNT' } as const));
          self.list = accounts;
          self.state = 'idle';
          self.error = null;
        } catch (error) {
          if (!axios.isCancel(error)) {
            self.list.length === 0;
            self.error = get(error, 'message', 'unkown error');
            self.state = 'error';
          }
        }
      }),
    };
  })
  .actions((self) => ({
    beforeDestroy() {
      self.controller?.abort();
    },
    afterCreate() {
      addDisposer(self, autorun(self.load));
    },
  }));
