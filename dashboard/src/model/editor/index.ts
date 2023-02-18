import { Instance, types } from 'mobx-state-tree';

export const EditorModel = types
  .model('EditorModel', {
    path: types.optional(types.string, '_FILTER_'),
    settings_open: types.optional(types.boolean, false),
  })
  .views((self) => ({}))
  .actions((self) => ({
    setPath(v: string) {
      self.path = v;
    },
    setSettingsOpen(v: boolean) {
      self.settings_open = v;
    },
  }))
  .actions((self) => ({
    open(path: string) {
      self.setPath(path);
      self.setSettingsOpen(true);
    },
  }));

export type EditorModelInstance = Instance<typeof EditorModel>;
