import { Checkbox, Group } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { CustomRichTextEditor } from '~/components/widgets/rich-text-editor/custom-rich-text-editor';
import { FilterCheckboxConfigInstance, FilterMetaInstance } from '~/model';
import { CustomDefaultValueEditor } from '../custom-default-value-editor';
import { useTranslation } from 'react-i18next';

interface IFilterEditorCheckbox {
  filter: FilterMetaInstance;
}

export const FilterEditorCheckbox = observer(function _FilterEditorCheckbox({ filter }: IFilterEditorCheckbox) {
  const { t } = useTranslation();
  const config = filter.config as FilterCheckboxConfigInstance;
  return (
    <>
      <Group position="apart">
        <Checkbox
          checked={config.default_value}
          onChange={(e) => config.setDefaultValue(e.currentTarget.checked)}
          label={t('filter.widget.checkbox.default_checked')}
        />
        <CustomDefaultValueEditor filter={filter} />
      </Group>
      <CustomRichTextEditor
        label={t('filter.widget.checkbox.description')}
        value={config.description}
        onChange={config.setDescription}
        styles={{ root: { flexGrow: 1, minHeight: '400px' } }}
      />
    </>
  );
});
