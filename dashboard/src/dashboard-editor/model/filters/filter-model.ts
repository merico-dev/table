import { Instance, SnapshotIn, SnapshotOut } from 'mobx-state-tree';
import { FilterMeta, IFilterMeta } from '~/model';

export type FilterUsageType = {};

export const FilterModel = FilterMeta.views((self) => ({
  get usage(): FilterUsageType[] {
    return [];
  },
})).actions((self) => ({}));

export type FilterModelInstance = Instance<typeof FilterModel>;
export type FilterModelSnapshotIn = SnapshotIn<FilterModelInstance>;
export type FilterModelSnapshotOut = SnapshotOut<FilterModelInstance>;

export interface IFilterModel extends IFilterMeta {
  usage: FilterUsageType[];
}
