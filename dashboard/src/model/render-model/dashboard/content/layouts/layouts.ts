import { IObservableArray, reaction } from 'mobx';
import { Instance, addDisposer, getRoot, types, IAnyStateTreeNode } from 'mobx-state-tree';
import { Layout } from 'react-grid-layout';
import { LayoutItemMetaInstance, LayoutSetMeta, LayoutSetMetaInstance, ILayoutSetMeta } from '~/model/meta-model';
import { typeAssert } from '~/types/utils';
import { IContentRenderModel } from '../../../../../dashboard-render';

function getRangeText({ min, max }: any) {
  const _min = `${min}px`;
  const _max = Number.isFinite(max) ? `${max}px` : '∞';
  return `[${_min}, ${_max})`;
}

export const LayoutsRenderModel = types
  .model('LayoutsRenderModel', {
    list: types.array(LayoutSetMeta),
    currentBreakpoint: types.string,
  })
  .views((self) => ({
    get json() {
      return self.list.map((o) => o.json);
    },
    jsonByPanelIDSet(panelIDSet: Set<string>) {
      return self.list.map((layoutSet) => {
        return layoutSet.jsonByPanelIDSet(panelIDSet);
      });
    },
    get root() {
      return getRoot(self);
    },
    get contentModel() {
      // @ts-expect-error type of getRoot
      return this.root.content;
    },
    get basisLayoutSet() {
      return self.list.find((s) => s.id === 'basis')!;
    },
    get currentLayoutSet() {
      return self.list.find((s) => s.id === self.currentBreakpoint) as LayoutSetMetaInstance;
    },
    get currentLayoutRange() {
      return this.breakpointRanges.find((r) => r.id === self.currentBreakpoint)!;
    },
    get currentRangeText() {
      const range = this.currentLayoutRange;
      return getRangeText(range);
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
    get breakpointNameRecord() {
      const ret: Record<string, number> = {};
      self.list.forEach((set) => {
        ret[set.name] = set.breakpoint;
      });
      return ret;
    },
    get breakpointRanges() {
      const ret = self.list.map((s) => {
        return {
          id: s.id,
          name: s.name,
          min: s.breakpoint,
          max: Infinity,
          text: '',
        };
      });
      ret
        .sort((a, b) => a.min - b.min)
        .forEach((r, i) => {
          if (i === ret.length - 1) {
            return;
          }
          r.max = ret[i + 1].min;
        });

      ret.forEach((r) => {
        r.text = getRangeText(r);
      });
      return ret;
    },
    get breakpointsInfo() {
      return self.list
        .map((l) => ({
          id: l.id,
          name: l.name,
          breakpoint: l.breakpoint,
        }))
        .sort((a, b) => a.breakpoint - b.breakpoint);
    },
    get currentBreakpointRange() {
      return this.breakpointRanges.find((r) => r.id === self.currentBreakpoint);
    },
    get currentLayoutPreviewWidth() {
      const r = this.currentBreakpointRange;
      if (!r) {
        return undefined;
      }
      if (r.max === Infinity) {
        return r.min === 0 ? undefined : r.min + 1;
      }
      return r.max;
    },
    items(panelIDs: string[]) {
      const panelIDSet = new Set(panelIDs);
      const layoutset = this.currentLayoutSet;
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
    findItemByPanelID(panelID: string) {
      const layout = this.currentLayoutSet.findByPanelID(panelID);
      return layout as LayoutItemMetaInstance;
    },
  }))
  .actions((self) => ({
    setCurrentBreakpoint(b: string) {
      console.log('🔴 onBreakpointChange:', b);
      self.currentBreakpoint = b;
    },
    afterCreate() {
      addDisposer(
        self,
        reaction(
          () => self.currentBreakpoint,
          () => {
            setTimeout(() => {
              window.dispatchEvent(new Event('resize'));
            }, 32);
          },
          {
            fireImmediately: false,
            delay: 0,
          },
        ),
      );
    },
  }));

export type LayoutsRenderModelInstance = Instance<typeof LayoutsRenderModel>;

export interface ILayoutBreakPointRange {
  id: string;
  name: string;
  min: number;
  max: number;
  text: string;
}

export interface ILayoutsRenderModel {
  list: IObservableArray<ILayoutSetMeta>;
  currentBreakpoint: string;

  readonly json: Array<ILayoutSetMeta['json']>;
  jsonByPanelIDSet(panelIDSet: Set<string>): Array<ILayoutSetMeta['json']>;
  readonly root: IAnyStateTreeNode;
  readonly contentModel: IContentRenderModel;
  readonly basisLayoutSet: ILayoutSetMeta;
  readonly currentLayoutSet: ILayoutSetMeta;
  readonly currentLayoutRange: ILayoutBreakPointRange;
  readonly currentRangeText: string;
  readonly cols: Record<string, 36>;
  readonly breakpoints: Record<string, number>;
  readonly breakpointNameRecord: Record<string, number>;
  readonly breakpointRanges: Array<ILayoutBreakPointRange>;
  readonly breakpointsInfo: Array<{
    id: string;
    name: string;
    breakpoint: number;
  }>;
  readonly currentBreakpointRange: ILayoutBreakPointRange | undefined;
  readonly currentLayoutPreviewWidth: number | undefined;
  items(panelIDs: string[]): Array<LayoutItemMetaInstance>;
  gridLayouts(panelIDs: string[]): Record<string, Layout[]>;
  findItemByPanelID(panelID: string): LayoutItemMetaInstance;

  setCurrentBreakpoint(b: string): void;
  afterCreate(): void;
}

typeAssert.shouldExtends<ILayoutsRenderModel, Instance<typeof LayoutsRenderModel>>();

typeAssert.shouldExtends<Instance<typeof LayoutsRenderModel>, ILayoutsRenderModel>();
