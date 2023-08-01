import { Checkbox, TextInput } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { FilterTextInputConfigInstance } from '~/model';

interface IFilterEditorTextInput {
  config: FilterTextInputConfigInstance;
}

export const FilterEditorTextInput = observer(function _FilterEditorTextInput({ config }: IFilterEditorTextInput) {
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
