import { Instance, SnapshotIn, types } from 'mobx-state-tree';
import { EViewComponentType } from '~/types';

export const ViewConfigModel_Division = types
  .model('ViewModel_Division', {
    _name: types.literal(EViewComponentType.Division),
  })
  .views((self) => ({
    get json() {
      const { _name } = self;
      return {
        _name,
      };
    },
  }))
  .actions((self) => ({}));

export type IViewConfigModel_Division = Instance<typeof ViewConfigModel_Division>;
export type IViewConfigModel_DivisionIn = SnapshotIn<IViewConfigModel_Division>;

export const createViewConfig_Division = () =>
  ViewConfigModel_Division.create({
    _name: EViewComponentType.Division,
  });
