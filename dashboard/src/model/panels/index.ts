import { randomId } from '@mantine/hooks';
import _ from 'lodash';
import { cast, types } from 'mobx-state-tree';
import { TableVizComponent } from '~/plugins/viz-components/table';
import { PanelModel, PanelModelInstance } from './panel';

export const PanelsModel = types
  .model('PanelsModel', {
    original: types.optional(types.array(PanelModel), []),
    current: types.optional(types.array(PanelModel), []),
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
    get layouts() {
      return self.current.map((o) => ({
        ...o.layout.json,
        i: o.id,
      }));
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
      replace(current: Array<PanelModelInstance>) {
        self.current = cast(current);
      },
      addANewPanel() {
        const id = randomId();
        self.current.push({
          id,
          layout: {
            x: 0,
            y: Infinity, // puts it at the bottom
            w: 3,
            h: 15,
          },
          title: `Panel - ${id}`,
          description: '<p><br></p>',
          queryID: '',
          viz: {
            type: TableVizComponent.name,
            conf: TableVizComponent.createConfig(),
          },
        });
      },
      append(item: PanelModelInstance) {
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
      duplicateByID(id: string) {
        const base = self.current.find((o) => o.id === id);
        if (!base) {
          console.error(new Error(`[duplicate panel] Can't find a panel by id[${id}]`));
          return;
        }
        self.current.push({
          ...base,
          id: randomId(),
          layout: {
            ...base.layout,
            x: 0,
            y: Infinity,
            moved: false,
          },
        });
      },
      replaceByIndex(index: number, replacement: PanelModelInstance) {
        self.current.splice(index, 1, replacement);
      },
    };
  });

export * from './panel';
