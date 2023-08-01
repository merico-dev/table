import { Instance, SnapshotIn, types } from 'mobx-state-tree';
import { EViewComponentType } from '../types';

export const ViewDivisionConfig = types
  .model('ViewDivisionConfig', {
    _name: types.literal(EViewComponentType.Division),
  })
  .views((self) => ({
    get json() {
      const { _name } = self;
      return {
        _name,
      };
    },
  }));

export type ViewDivisionConfigInstance = Instance<typeof ViewDivisionConfig>;
export type ViewDivisionConfigSnapshotIn = SnapshotIn<ViewDivisionConfigInstance>;

export const createViewDivisionConfig = () =>
  ViewDivisionConfig.create({
    _name: EViewComponentType.Division,
  });
