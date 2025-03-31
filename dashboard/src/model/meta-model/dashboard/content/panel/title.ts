import { types, type Instance } from 'mobx-state-tree';
import { typeAssert } from '~/types/utils';

export const PanelTitleMeta = types
  .model('PanelTitleMeta', {
    show: types.optional(types.boolean, true),
  })
  .views((self) => ({
    get json() {
      const { show } = self;
      return {
        show,
      };
    },
  }))
  .actions((self) => ({
    setShow(v: boolean) {
      self.show = v;
    },
  }));

export interface IPanelTitleMeta {
  show: boolean;
  json: {
    show: boolean;
  };

  setShow(v: boolean): void;
}

typeAssert.shouldExtends<IPanelTitleMeta, Instance<typeof PanelTitleMeta>>();
typeAssert.shouldExtends<Instance<typeof PanelTitleMeta>, IPanelTitleMeta>();
