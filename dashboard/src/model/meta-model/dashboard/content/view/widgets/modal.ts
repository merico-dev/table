import { getParent, getRoot, Instance, SnapshotIn, types } from 'mobx-state-tree';
import { EViewComponentType, TPayloadForSQLSnippet } from '~/model';
import { typeAssert } from '~/types/utils';

const CustomModalTitleModel = types
  .model('CustomModalTitleModel', {
    enabled: types.optional(types.boolean, false),
    func_content: types.optional(types.string, ''),
  })
  .views((self) => ({
    get json() {
      const { enabled, func_content } = self;
      return {
        enabled,
        func_content,
      };
    },
    get value() {
      const { enabled, func_content } = self;
      const view = getParent(self, 2) as any; // ViewMeta
      const root = getRoot(self) as any; // FIXME: it shouldn't be in meta model
      if (!enabled) {
        return view.name;
      }
      try {
        const params = {
          filters: root.content.filters.valuesForPayload,
          context: root.context.current,
        };

        const ret = new Function(`return ${func_content}`)()(params);
        return ret;
      } catch (error) {
        console.error(error);
        return view.name;
      }
    },
  }))
  .actions((self) => ({
    setEnabled(v: boolean) {
      self.enabled = v;
    },
    setFuncContent(v: string) {
      self.func_content = v;
    },
    replace({ enabled, func_content }: { enabled: boolean; func_content: string }) {
      self.enabled = enabled;
      self.func_content = func_content;
    },
  }));

export interface ICustomModalTitleModel {
  enabled: boolean;
  func_content: string;
  readonly json: { enabled: boolean; func_content: string };
  readonly value: string;
  setEnabled(v: boolean): void;
  setFuncContent(v: string): void;
  replace({ enabled, func_content }: { enabled: boolean; func_content: string }): void;
}

typeAssert.shouldExtends<ICustomModalTitleModel, Instance<typeof CustomModalTitleModel>>();

export interface ICustomModalTitle {
  enabled: boolean;
  func_content: string;
}

export const DEFAULT_CUSTOM_MODAL_TITLE = {
  enabled: false,
  func_content: ['function text({ filters, context}) {', '    // your code goes here', '    return "text"', '}'].join(
    '\n',
  ),
};

export const ViewModalConfig = types
  .model('ViewModalConfig', {
    _name: types.literal(EViewComponentType.Modal),
    width: types.string,
    height: types.string,
    custom_modal_title: types.optional(CustomModalTitleModel, DEFAULT_CUSTOM_MODAL_TITLE),
  })
  .views((self) => ({
    get json() {
      const { _name, width, height, custom_modal_title } = self;
      return {
        _name,
        width,
        height,
        custom_modal_title: custom_modal_title.json,
      };
    },
  }))
  .actions((self) => ({
    setWidth(v: string) {
      self.width = v;
    },
    setHeight(v: string) {
      self.height = v;
    },
  }));

export type ViewModalConfigInstance = Instance<typeof ViewModalConfig>;
export type ViewModalConfigSnapshotIn = SnapshotIn<ViewModalConfigInstance>;

export interface IViewModalConfig {
  _name: EViewComponentType.Modal;
  width: string;
  height: string;
  custom_modal_title: ICustomModalTitleModel;
  readonly json: {
    _name: EViewComponentType.Modal;
    width: string;
    height: string;
    custom_modal_title: { enabled: boolean; func_content: string };
  };
  setWidth(v: string): void;
  setHeight(v: string): void;
}

typeAssert.shouldExtends<IViewModalConfig, Instance<typeof ViewModalConfig>>();

export const createViewModalConfig = () =>
  ViewModalConfig.create({
    _name: EViewComponentType.Modal,
    width: '90vw',
    height: '90vh',
  });
