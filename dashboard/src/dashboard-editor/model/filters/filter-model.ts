import { Instance, SnapshotIn, SnapshotOut } from 'mobx-state-tree';
import { FilterMeta, IFilterMeta } from '~/model';

export type FilterUsageType =
  | {
      filterID: string;
      type: 'query';
      type_label: 'query.label';
      id: string;
      label: string;
    }
  | {
      filterID: string;
      type: 'view';
      type_label: 'view.label';
      id: string;
      label: string;
    }
  | {
      filterID: string;
      type: 'sql_snippet';
      type_label: 'sql_snippet.label';
      id: string;
      label: string;
    };

export const FilterModel = FilterMeta.views((self) => ({
  get usages(): FilterUsageType[] {
    return self.contentModel.findFilterUsage(self.id);
  },
})).actions((self) => ({}));

export type FilterModelInstance = Instance<typeof FilterModel>;
export type FilterModelSnapshotIn = SnapshotIn<FilterModelInstance>;
export type FilterModelSnapshotOut = SnapshotOut<FilterModelInstance>;

export interface IFilterModel extends IFilterMeta {
  usages: FilterUsageType[];
}
