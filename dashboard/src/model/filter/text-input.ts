import { Instance, types } from 'mobx-state-tree';

export const FilterConfigModel_TextInput = types
  .model('FilterConfigModel_TextInput', {
    required: types.boolean,
    default_value: types.string,
  })
  .actions((self) => ({
    setRequired(required: boolean) {
      self.required = required;
    },
    setDefaultValue(default_value: string) {
      self.default_value = default_value;
    },
  }));

export type IFilterConfig_TextInput = Instance<typeof FilterConfigModel_TextInput>;

export const createFilterConfig_TextInput = () =>
  FilterConfigModel_TextInput.create({
    required: false,
    default_value: '',
  });
