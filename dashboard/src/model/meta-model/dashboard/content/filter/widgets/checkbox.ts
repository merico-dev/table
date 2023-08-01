import { Instance, types } from 'mobx-state-tree';

export const FilterCheckboxConfigMeta = types
  .model('FilterCheckboxConfigMeta', {
    _name: types.literal('checkbox'),
    description: types.optional(types.string, ''),
    default_value: types.boolean,
  })
  .views((self) => ({
    get json() {
      const { _name, description, default_value } = self;
      return {
        _name,
        description,
        default_value,
      };
    },
    get isDescriptionEmpty() {
      const { description } = self;
      return description === '' || description === '<p></p>';
    },
  }))
  .actions((self) => ({
    setDefaultValue(default_value: boolean) {
      self.default_value = default_value;
    },
    setDescription(v: string) {
      self.description = v;
    },
  }));

export type FilterCheckboxConfigInstance = Instance<typeof FilterCheckboxConfigMeta>;

export const createFilterCheckboxConfig = () =>
  FilterCheckboxConfigMeta.create({
    _name: 'checkbox',
    description: '',
    default_value: false,
  });
