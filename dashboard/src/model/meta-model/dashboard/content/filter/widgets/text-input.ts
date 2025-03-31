import { Instance, types } from 'mobx-state-tree';
import { typeAssert } from '~/types/utils';

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

export interface IFilterTextInputConfig {
  // Properties
  _name: 'text-input';
  required: boolean;
  default_value: string;

  // Views
  readonly json: {
    _name: 'text-input';
    required: boolean;
    default_value: string;
  };
  truthy(value: unknown): boolean;

  // Actions
  setRequired(required: boolean): void;
  setDefaultValue(default_value: string): void;
}

typeAssert.shouldExtends<IFilterTextInputConfig, FilterTextInputConfigInstance>();

export const createFilterTextInputConfig = () =>
  FilterTextInputConfigMeta.create({
    _name: 'text-input',
    required: false,
    default_value: '',
  });
