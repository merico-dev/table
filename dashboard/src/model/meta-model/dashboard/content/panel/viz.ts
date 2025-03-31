import { isEqual } from 'lodash';
import { types, type Instance } from 'mobx-state-tree';
import { AnyObject } from '~/types';
import { typeAssert } from '~/types/utils';

export const PanelVizMeta = types
  .model('PanelVizMeta', {
    type: types.string,
    conf: types.frozen<AnyObject>(),
  })
  .views((self) => ({
    get json() {
      return {
        conf: self.conf,
        type: self.type,
      };
    },
  }))
  .actions((self) => ({
    setType(type: string) {
      self.type = type;
    },
    setConf(conf: AnyObject) {
      if (isEqual(self.conf, conf)) return;
      self.conf = conf;
    },
  }));

export interface IPanelVizMeta {
  type: string;
  conf: AnyObject;
  readonly json: { type: string; conf: AnyObject };
  setType(type: string): void;
  setConf(conf: AnyObject): void;
}

typeAssert.shouldExtends<IPanelVizMeta, Instance<typeof PanelVizMeta>>();

typeAssert.shouldExtends<Instance<typeof PanelVizMeta>, IPanelVizMeta>();
