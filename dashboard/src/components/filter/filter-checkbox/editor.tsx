import { Checkbox, Group } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { CustomRichTextEditor } from '~/components/widgets/rich-text-editor/custom-rich-text-editor';
import { FilterCheckboxConfigInstance, FilterMetaInstance } from '~/model';
import { CustomDefaultValueEditor } from '../custom-default-value-editor';

interface IFilterEditorCheckbox {
  filter: FilterMetaInstance;
}

export const FilterEditorCheckbox = observer(({ filter }: IFilterEditorCheckbox) => {
  const { t } = useTranslation();
  const config = filter.config as FilterCheckboxConfigInstance;
  return (
    <>
      <Group justify="space-between">
        <Checkbox
          checked={config.default_value}
          onChange={(e) => config.setDefaultValue(e.currentTarget.checked)}
          label={t('filter.widget.checkbox.default_checked')}
        />
        <CustomDefaultValueEditor filter={filter} />
      </Group>
      <CustomRichTextEditor
        key={filter.id}
        label={t('filter.widget.checkbox.description')}
        value={config.description}
        onChange={config.setDescription}
        styles={{ root: { flexGrow: 1, minHeight: '400px' } }}
      />
    </>
  );
});
