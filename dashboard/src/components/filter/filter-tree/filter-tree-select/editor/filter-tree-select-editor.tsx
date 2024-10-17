import { Checkbox, Divider, Group, NumberInput, TextInput } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { FilterMetaInstance, FilterTreeSelectConfigInstance } from '~/model';
import { ExpectedStructureForTreeSelect } from '../../common/expected-structure';
import { useTranslation } from 'react-i18next';
import { CustomDefaultValueEditor } from '~/components/filter/custom-default-value-editor';
import { PickQueryForFilter } from '~/components/filter/pick-query-for-filter';

interface IFilterEditorTreeSelect {
  filter: FilterMetaInstance;
}

export const FilterEditorTreeSelect = observer(function _FilterEditorTreeSelect({ filter }: IFilterEditorTreeSelect) {
  const { t } = useTranslation();
  const config = filter.config as FilterTreeSelectConfigInstance;
  return (
    <>
      <Group justify="space-between">
        <Checkbox
          checked={config.required}
          onChange={(e) => config.setRequired(e.currentTarget.checked)}
          label={t('filter.widget.select.required')}
        />
        <CustomDefaultValueEditor filter={filter} />
      </Group>
      <TextInput
        label={t('filter.widget.common.min_width')}
        value={config.min_width}
        onChange={(e) => config.setMinWidth(e.currentTarget.value)}
        placeholder="200px"
      />
      <Divider label={t('filter.widget.common.fetch_options_from_datasource')} labelPosition="center" />
      <Checkbox
        checked={config.treeCheckStrictly}
        onChange={(e) => config.setTreeCheckStrictly(e.currentTarget.checked)}
        label={t('filter.widget.tree_select.strictly')}
      />
      <NumberInput
        value={config.default_selection_count}
        onChange={config.setDefaultSelectionCount}
        label={t('filter.widget.common.default_selection_count')}
      />
      <PickQueryForFilter value={config.options_query_id} onChange={config.setOptionsQueryID} />
      <ExpectedStructureForTreeSelect />
    </>
  );
});
