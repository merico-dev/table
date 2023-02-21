import { types } from 'mobx-state-tree';

export const DashboardBriefModel = types
  .model('DashboardBriefModel', {
    id: types.identifier,
    name: types.string,
    group: types.string,
    is_preset: types.maybe(types.boolean),
    // for simplicity, use string for the date time type for now
    create_time: types.string,
    update_time: types.string,
    is_removed: types.boolean,
  })
  .views((self) => ({
    get isEditable() {
      return !self.is_preset;
    },
  }));
