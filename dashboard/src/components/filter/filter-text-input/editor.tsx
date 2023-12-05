import { Checkbox, TextInput } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { FilterMetaInstance, FilterTextInputConfigInstance } from '~/model';

interface IFilterEditorTextInput {
  filter: FilterMetaInstance;
}

export const FilterEditorTextInput = observer(function _FilterEditorTextInput({ filter }: IFilterEditorTextInput) {
  const config = filter.config as FilterTextInputConfigInstance;
  return (
    <>
      <TextInput
        label="Default Value"
        value={config.default_value}
        onChange={(e) => {
          config.setDefaultValue(e.currentTarget.value);
        }}
      />
      <Checkbox
        checked={config.required}
        onChange={(e) => config.setRequired(e.currentTarget.checked)}
        label="Required"
      />
    </>
  );
});
