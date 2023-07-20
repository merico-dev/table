import { Checkbox } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { CustomRichTextEditor } from '~/form-inputs/rich-text-editor/custom-rich-text-editor';
import { IFilterConfig_Checkbox } from '~/dashboard-editor/model/filters/filter/checkbox';

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
      <CustomRichTextEditor
        label="Description"
        value={config.description}
        onChange={config.setDescription}
        styles={{ root: { flexGrow: 1, minHeight: '400px' } }}
      />
    </>
  );
});
