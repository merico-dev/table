import { Checkbox, TextInput } from '@mantine/core';
import { IFilterConfig_TextInput } from '../../model/filter/text-input';

interface IFilterEditorTextInput {
  config: IFilterConfig_TextInput;
}

export function FilterEditorTextInput({ config }: IFilterEditorTextInput) {
  return (
    <>
      <TextInput label="Default Value" value={config.default_value} onChange={console.log} />
      <Checkbox checked={config.required} onChange={(e) => console.log(e.currentTarget.checked)} label="Required" />
    </>
  );
}
