import { Checkbox } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { CustomRichTextEditor } from '~/components/widgets/rich-text-editor/custom-rich-text-editor';
import { FilterCheckboxConfigInstance } from '~/model';

interface IFilterEditorCheckbox {
  config: FilterCheckboxConfigInstance;
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
