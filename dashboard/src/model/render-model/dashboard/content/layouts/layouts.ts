import { Instance, getRoot, types } from 'mobx-state-tree';
import { Layout } from 'react-grid-layout';
import { LayoutItemMetaInstance, LayoutSetMeta, LayoutSetMetaInstance } from '~/model/meta-model';

export const LayoutsRenderModel = types
  .model('LayoutsRenderModel', {
    list: types.array(LayoutSetMeta),
    currentBreakpoint: types.string,
  })
  .views((self) => ({
    get json() {
      return self.list.map((o) => o.json);
    },
    get root() {
      return getRoot(self);
    },
    get contentModel() {
      // @ts-expect-error type of getRoot
      return this.root.content;
    },
    get currentLayoutSet() {
      return self.list.find((s) => s.id === self.currentBreakpoint) as LayoutSetMetaInstance;
    },
    get cols() {
      const ret: Record<string, 36> = {};
      self.list.forEach((set) => {
        ret[set.id] = 36;
      });
      return ret;
    },
    get breakpoints() {
      const ret: Record<string, number> = {};
      self.list.forEach((set) => {
        ret[set.id] = set.breakpoint;
      });
      return ret;
    },
    get breakpointRanges() {
      const ret = self.list.map((s) => {
        return {
          id: s.id,
          min: s.breakpoint,
          max: Infinity,
        };
      });
      ret
        .sort((a, b) => a.min - b.min)
        .forEach((r, i) => {
          if (i === ret.length - 1) {
            return;
          }
          r.max = ret[i + 1].min - 1;
        });
      return ret;
    },
    get breakpointOptions() {
      return self.list
        .map((l) => ({
          label: l.id,
          value: l.breakpoint,
        }))
        .sort((a, b) => a.value - b.value);
    },
    items(panelIDs: string[]) {
      const panelIDSet = new Set(panelIDs);
      const layoutset = self.list[0];
      return layoutset.list.filter((l) => panelIDSet.has(l.panelID));
    },
    gridLayouts(panelIDs: string[]) {
      const panelIDSet = new Set(panelIDs);
      const ret: Record<string, Layout[]> = {};
      self.list.forEach((set) => {
        ret[set.id] = set.list.filter((l) => panelIDSet.has(l.panelID)).map((l) => l.layoutProperies);
      });
      return ret;
    },
    findByPanelID(panelID: string) {
      const layout = self.list[0].findByID(panelID);
      return layout as LayoutItemMetaInstance;
    },
  }))
  .actions((self) => ({
    setCurrentBreakpoint(b: string) {
      self.currentBreakpoint = b;
    },
  }));

export type LayoutsRenderModelInstance = Instance<typeof LayoutsRenderModel>;
