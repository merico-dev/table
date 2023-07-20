import { Checkbox, TextInput } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { IFilterConfig_TextInput } from '../../../model/filters/filter/text-input';

interface IFilterEditorTextInput {
  config: IFilterConfig_TextInput;
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
