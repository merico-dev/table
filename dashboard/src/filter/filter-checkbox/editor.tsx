import { Checkbox } from '@mantine/core';
import { IFilterConfig_Checkbox } from '../../model/filter/checkbox';

interface IFilterEditorCheckbox {
  config: IFilterConfig_Checkbox;
  index: number;
}

export function FilterEditorCheckbox({ config }: IFilterEditorCheckbox) {
  return (
    <>
      <Checkbox
        checked={config.default_value}
        onChange={(e) => console.log(e.currentTarget.checked)}
        label="Default Checked"
      />
    </>
  );
}
