import _ from 'lodash';
import { cast, types } from 'mobx-state-tree';
import { EViewComponentType } from '~/types';
import { ViewModel, ViewModelInstance } from './view';

export const ViewsModel = types
  .model('ViewsModel', {
    original: types.optional(types.array(ViewModel), []),
    current: types.optional(types.array(ViewModel), []),
    visibleViewIDs: types.array(types.string),
  })
  .views((self) => ({
    get changed() {
      if (self.original.length !== self.current.length) {
        return true;
      }
      return self.original.some((o, i) => {
        return !_.isEqual(o.json, self.current[i].json);
      });
    },
    get json() {
      return self.current.map((o) => o.json);
    },
    findByID(id: string) {
      return self.current.find((query) => query.id === id);
    },
  }))
  .actions((self) => {
    return {
      reset() {
        const o = self.original.map((o) => ({
          ...o,
        }));
        self.current.length = 0;
        self.current.unshift(...o);
      },
      replace(current: Array<ViewModelInstance>) {
        self.current = cast(current);
      },
      addANewView(id: string, type: EViewComponentType, config: Record<string, any>) {
        self.current.push({
          id,
          type,
          config,
          panels: [],
        });
      },
      append(item: ViewModelInstance) {
        self.current.push(item);
      },
      remove(index: number) {
        self.current.splice(index, 1);
      },
      removeByID(id: string) {
        const index = self.current.findIndex((o) => o.id === id);
        if (index === -1) {
          return;
        }
        self.current.splice(index, 1);
      },
      replaceByIndex(index: number, replacement: ViewModelInstance) {
        self.current.splice(index, 1, replacement);
      },
    };
  });

export * from './view';
