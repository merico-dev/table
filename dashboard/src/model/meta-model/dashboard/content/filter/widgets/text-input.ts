import { Instance, types } from 'mobx-state-tree';

export const FilterTextInputConfigMeta = types
  .model('FilterTextInputConfigMeta', {
    _name: types.literal('text-input'),
    required: types.boolean,
    default_value: types.string,
  })
  .views((self) => ({
    get json() {
      const { _name, required, default_value } = self;
      return {
        _name,
        required,
        default_value,
      };
    },
    truthy(value: any) {
      if (typeof value !== 'string') {
        return false;
      }
      return !!value.trim();
    },
  }))
  .actions((self) => ({
    setRequired(required: boolean) {
      self.required = required;
    },
    setDefaultValue(default_value: string) {
      self.default_value = default_value;
    },
  }));

export type FilterTextInputConfigInstance = Instance<typeof FilterTextInputConfigMeta>;

export const createFilterTextInputConfig = () =>
  FilterTextInputConfigMeta.create({
    _name: 'text-input',
    required: false,
    default_value: '',
  });
