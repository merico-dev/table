import { reaction, toJS } from 'mobx';
import { addDisposer, getParent, getRoot, Instance, types } from 'mobx-state-tree';
import { shallowToJS } from '~/utils';
import { FilterBaseSelectConfigMeta } from './select-base';

export const FilterSelectConfigMeta = types
  .compose(
    'FilterConfigModel_Select',
    types.model({
      _name: types.literal('select'),
      default_value: types.string,
      width: types.optional(types.string, ''),
    }),
    FilterBaseSelectConfigMeta,
  )
  .views((self) => ({
    get json() {
      const { _name, default_value, required, width, static_options, options_query_id, default_selection_count } = self;
      return shallowToJS({
        _name,
        width,
        required,
        default_value,
        static_options,
        options_query_id,
        default_selection_count,
      });
    },
    truthy(value: any) {
      return !!value;
    },
    getSelectOption(value: string) {
      return self.options.find((o) => o.value === value);
    },
    get default_selection() {
      if (!self.usingQuery) {
        return self.filter.formattedDefaultValue;
      }
      if (self.default_selection_count > 0 && self.options.length > 0) {
        return self.options[0].value;
      }
      return '';
    },
  }))
  .actions((self) => ({
    setDefaultValue(default_value: string) {
      self.default_value = default_value;
    },
    setWidth(v: string) {
      self.width = v;
    },
    setDefaultSelection() {
      // @ts-expect-error getRoot type
      const filters = getRoot(self).content.filters;
      // @ts-expect-error Property 'key' does not exist on type 'IStateTreeNode<IAnyStateTreeNode>
      const key = getParent(self).key;
      const currentValue = filters.values[key];
      const validValue = self.options.find((o) => o.value === currentValue)?.value;
      if (validValue) {
        filters.setValueByKey(key, validValue);
      } else {
        filters.setValueByKey(key, self.default_selection);
      }
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

export type FilterSelectConfigInstance = Instance<typeof FilterSelectConfigMeta>;

export const createFilterSelectConfig = () =>
  FilterSelectConfigMeta.create({
    _name: 'select',
    required: false,
    default_value: '',
    static_options: [],
    options_query_id: '',
    default_selection_count: 0,
  });
