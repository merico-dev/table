import { randomId } from '@mantine/hooks';
import _ from 'lodash';
import { castToSnapshot, getParent, types } from 'mobx-state-tree';
import { NavOptionType } from '~/model/editor';
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
    findByID(id: string) {
      return self.list.find((query) => query.id === id);
    },
    panelsByIDs(ids: string[]) {
      const set = new Set(ids);
      const panels = self.list.filter((p) => set.has(p.id));
      const layouts = panels.map((o) => ({
        ...o.layout.json,
        i: o.id,
      }));
      return { panels, layouts };
    },
    get editorOptions() {
      // @ts-expect-error type of getParent
      const parentID = getParent(self, 1).id;
      const ret = self.list.map(
        (o) =>
          ({
            label: o.title ? o.title : _.capitalize(o.viz.type),
            value: o.id,
            _type: 'panel',
            parentID,
          } as NavOptionType),
      );
      const _action_type = '_Add_A_PANEL_';
      ret.push({
        label: _action_type,
        value: _action_type,
        _type: 'ACTION',
        _action_type,
        parentID,
        Icon: null,
        children: null,
      } as const);
      return ret;
    },
  }))
  .actions((self) => {
    return {
      replace(current: Array<PanelModelInstance>) {
        self.list = castToSnapshot(current);
      },
      addANewPanel() {
        const id = new Date().getTime().toString();
        self.list.push({
          id,
          layout: {
            x: 0,
            y: Infinity, // puts it at the bottom
            w: 3,
            h: 15,
          },
          title: id,
          description: '<p></p>',
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
          ...base.json,
          id: randomId(),
          layout: {
            ...base.layout,
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
