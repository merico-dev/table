import { Checkbox } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { IFilterConfig_Checkbox } from '../../model/filters/filter/checkbox';

interface IFilterEditorCheckbox {
  config: IFilterConfig_Checkbox;
  index: number;
}

export const FilterEditorCheckbox = observer(function _FilterEditorCheckbox({ config }: IFilterEditorCheckbox) {
  return (
    <>
      <Checkbox
        checked={config.default_value}
        onChange={(e) => config.setDefaultValue(e.currentTarget.checked)}
        label="Default Checked"
      />
    </>
  );
});
