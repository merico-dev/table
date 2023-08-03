import { types } from 'mobx-state-tree';
import { AnyObject } from '~/types';

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
      self.conf = conf;
    },
  }));
