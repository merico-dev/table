import { getParent, getRoot, Instance, SnapshotIn, types } from 'mobx-state-tree';
import { DEFAULT_CUSTOM_MODAL_TITLE } from '~/main/dashboard-editor/navbar/edit-view-modal/config-fields/modal/modal-title-editor/types';
import { EViewComponentType } from '~/types';

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
      const view = getParent(self, 2) as any;
      const root = getRoot(self) as any;
      if (!enabled) {
        return view.name;
      }
      try {
        const params = {
          filters: root.filters.values,
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

export const ViewConfigModel_Modal = types
  .model('ViewModel_Modal', {
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

export type IViewConfigModel_Modal = Instance<typeof ViewConfigModel_Modal>;
export type IViewConfigModel_ModalIn = SnapshotIn<IViewConfigModel_Modal>;

export const createViewConfig_Modal = () =>
  ViewConfigModel_Modal.create({
    _name: EViewComponentType.Modal,
    width: '90vw',
    height: '90vh',
  });
