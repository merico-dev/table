import { types } from 'mobx-state-tree';

export const FilterModel = types.model('FilterModel', {
  key: types.string,
  label: types.string,
  order: types.number,
  type: types.enumeration(['select', 'multi-select', 'text-input', 'checkbox', 'date-range']),
});
