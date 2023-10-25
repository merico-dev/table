import _ from 'lodash';
import { Instance, SnapshotIn, types } from 'mobx-state-tree';

export const VariableMeta = types
  .model('VariableMeta', {
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
        type: types.enumeration(['none', 'sum', 'mean', 'median', 'min', 'max', 'CV', 'std']),
        // maybe undefined is better
        config: types.frozen(),
        fallback: types.optional(types.string, '0'),
      }),
      types.model({
        type: types.literal('quantile'),
        config: types.model({ p: types.number }),
        fallback: types.optional(types.string, '0'),
      }),
      types.model({
        type: types.literal('custom'),
        config: types.model({ func: types.string }),
        fallback: types.optional(types.string, '0'),
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

export type VariableMetaType = typeof VariableMeta;
export type VariableMetaSnapshotIn = SnapshotIn<VariableMetaType>;
export type VariableMetaInstance = Instance<VariableMetaType>;
