import _ from 'lodash';
import { isEqual } from 'lodash';
import { makeAutoObservable } from 'mobx';
import { applySnapshot, clone, getSnapshot, IAnyStateTreeNode, SnapshotIn, types } from 'mobx-state-tree';

export const VariableModel = types
  .model('VariableModel', {
    name: types.string,
    size: types.string,
    weight: types.string,
    color: types.union(
      types.model({ type: types.literal('static'), staticColor: types.string }),
      types.model({
        type: types.literal('continuous'),
        valueRange: types.array(types.number),
        colorRange: types.array(types.string),
      }),
      types.model({ type: types.literal('piecewise') }),
    ),
    formatter: types.model({
      output: types.enumeration('Output', ['number', 'percent']),
      average: types.optional(types.boolean, false),
      mantissa: types.number,
      trimMantissa: types.optional(types.boolean, false),
    }),
    data_field: types.string,
    aggregation: types.union(
      types.model({
        type: types.enumeration(['none', 'sum', 'mean', 'median', 'min', 'max']),
        // maybe undefined is better
        config: types.frozen(),
      }),
      types.model({
        type: types.literal('quantile'),
        config: types.model({ p: types.number }),
      }),
    ),
  })
  .views((self) => ({
    get json() {
      const { name, size, weight, color, formatter, data_field, aggregation } = self;
      return _.cloneDeep({
        name,
        size,
        color,
        weight,
        formatter,
        data_field,
        aggregation,
      });
    },
  }));

export class DraftModel<T extends IAnyStateTreeNode> {
  origin: T;
  copy: T;

  constructor(state: T) {
    this.origin = state;
    this.copy = clone(state);
    makeAutoObservable(this, {}, { autoBind: true, deep: false });
  }

  get changed() {
    return !isEqual(getSnapshot(this.origin), getSnapshot(this.copy));
  }

  commit() {
    applySnapshot(this.origin, getSnapshot(this.copy));
  }

  update(patch: SnapshotIn<T>) {
    applySnapshot(this.copy, patch);
  }
}

export const createDraft = <T extends IAnyStateTreeNode>(origin: T) => {
  return new DraftModel(origin);
};
