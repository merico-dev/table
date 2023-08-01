import { reaction, toJS } from 'mobx';
import { addDisposer, cast, getParent, getRoot, Instance, types } from 'mobx-state-tree';
import { FilterBaseSelectConfigMeta } from './select-base';
import { shallowToJS } from '~/utils/shallow-to-js';

export const FilterMultiSelectConfigMeta = types
  .compose(
    'FilterMultiSelectConfigMeta',
    types.model({
      _name: types.literal('multi-select'),
      min_width: types.optional(types.string, ''),
      default_value: types.optional(types.array(types.string), []),
    }),
    FilterBaseSelectConfigMeta,
  )
  .views((self) => ({
    get json() {
      const { _name, default_value, min_width, static_options, options_query_id, default_selection_count } = self;
      return shallowToJS({
        _name,
        min_width,
        default_value,
        static_options,
        options_query_id,
        default_selection_count,
      });
    },
    get default_selection() {
      if (!self.usingQuery) {
        return self.default_value;
      }
      return self.options.slice(0, self.default_selection_count).map((o: any) => o.value);
    },
  }))
  .actions((self) => ({
    setDefaultValue(default_value: string[]) {
      self.default_value = cast(default_value);
    },
    setMinWidth(v: string) {
      self.min_width = v;
    },
    setDefaultSelection() {
      // @ts-expect-error getRoot type
      const filters = getRoot(self).content.filters;
      // @ts-expect-error Property 'key' does not exist on type 'IStateTreeNode<IAnyStateTreeNode>
      const key = getParent(self).key;
      filters.setValueByKey(key, self.default_selection);
    },
  }))
  .actions((self) => ({
    afterCreate() {
      addDisposer(
        self,
        reaction(() => toJS(self.default_selection), self.setDefaultSelection, {
          fireImmediately: true,
          delay: 0,
        }),
      );
    },
  }));

export type FilterMultiSelectConfigInstance = Instance<typeof FilterMultiSelectConfigMeta>;

export const createFilterMultiSelectConfig = () =>
  FilterMultiSelectConfigMeta.create({
    _name: 'multi-select',
    default_value: [],
    static_options: [],
    options_query_id: '',
    default_selection_count: 0,
  });
