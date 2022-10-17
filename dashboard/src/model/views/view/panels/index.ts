import { randomId } from '@mantine/hooks';
import _ from 'lodash';
import { cast, types } from 'mobx-state-tree';
import { TableVizComponent } from '~/plugins/viz-components/table';
import { PanelModel, PanelModelInstance } from './panel';

export const PanelsModel = types
  .model('PanelsModel', {
    list: types.optional(types.array(PanelModel), []),
  })
  .views((self) => ({
    get json() {
      return self.list.map((o) => o.json);
    },
    get layouts() {
      return self.list.map((o) => ({
        ...o.layout.json,
        i: o.id,
      }));
    },
    findByID(id: string) {
      return self.list.find((query) => query.id === id);
    },
  }))
  .actions((self) => {
    return {
      replace(current: Array<PanelModelInstance>) {
        self.list = cast(current);
      },
      addANewPanel() {
        const id = randomId();
        self.list.push({
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
          style: {
            border: {
              enabled: true,
            },
          },
        });
      },
      append(item: PanelModelInstance) {
        self.list.push(item);
      },
      remove(index: number) {
        self.list.splice(index, 1);
      },
      removeByID(id: string) {
        const index = self.list.findIndex((o) => o.id === id);
        if (index === -1) {
          return;
        }
        self.list.splice(index, 1);
      },
      duplicateByID(id: string) {
        const base = self.list.find((o) => o.id === id);
        if (!base) {
          console.error(new Error(`[duplicate panel] Can't find a panel by id[${id}]`));
          return;
        }
        self.list.push({
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
        self.list.splice(index, 1, replacement);
      },
    };
  });

export * from './panel';
