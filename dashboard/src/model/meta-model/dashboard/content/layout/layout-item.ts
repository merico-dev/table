import { Instance, getRoot, types } from 'mobx-state-tree';
import { Layout } from 'react-grid-layout';
import type { IPanelRenderModel } from '~/model/render-model';
import { typeAssert } from '~/types/utils';

export const LayoutItemMeta = types
  .model('LayoutItemMeta', {
    id: types.identifier,
    panelID: types.string,
    x: types.number,
    y: types.maybeNull(types.number),
    w: types.number,
    h: types.number,
    moved: types.optional(types.boolean, false),
    static: types.optional(types.boolean, false),
  })
  .views((self) => ({
    get json() {
      const { id, panelID, x, y, w, h, moved } = self;
      return {
        h,
        w,
        x,
        y: y === null ? 0 : y,
        id,
        moved,
        static: self.static,
        panelID,
      };
    },
    // FIXME: should move these to LayoutItemRenderModel & solve type errors
    get contentModel() {
      // @ts-expect-error typeof getRoot
      return getRoot(self).content;
    },
    get panel() {
      const { panelID } = self;
      return this.contentModel.panels.findByID(panelID);
    },
    get layoutProperies() {
      const { id, x, y, w, h, moved } = self;
      return { id, i: id, x, y: y === null ? Infinity : y, w, h, moved, static: self.static } as Layout;
    },
  }))
  .actions((self) => ({
    set(layout: Omit<Layout, 'i'>) {
      const { isDraggable, x, y, w, h, moved } = layout;
      self.x = x;
      self.y = y;
      self.w = w;
      self.h = h;
      self.moved = !!moved;
      self.static = !!layout.static;
    },
    setWidth(w: number) {
      self.w = w;
    },
    setHeight(h: number) {
      self.h = h;
    },
  }));

export type LayoutItemMetaInstance = Instance<typeof LayoutItemMeta>;

export interface ILayoutItemMeta {
  id: string;
  panelID: string;
  x: number;
  y: number | null;
  w: number;
  h: number;
  moved: boolean;
  static: boolean;

  readonly json: {
    h: number;
    w: number;
    x: number;
    y: number;
    id: string;
    moved: boolean;
    static: boolean;
    panelID: string;
  };

  readonly contentModel: Record<string, unknown>; // FIXME: should move to LayoutItemRenderModel
  readonly panel: IPanelRenderModel;
  readonly layoutProperies: Layout;

  set(layout: Omit<Layout, 'i'>): void;
  setWidth(w: number): void;
  setHeight(h: number): void;
}

typeAssert.shouldExtends<ILayoutItemMeta, LayoutItemMetaInstance>();
typeAssert.shouldExtends<LayoutItemMetaInstance, ILayoutItemMeta>();

export type LayoutItem = {
  id: string;
  panelID: string;
  x: number;
  y: number | null;
  w: number;
  h: number;
  moved?: boolean;
  static?: boolean;
};
