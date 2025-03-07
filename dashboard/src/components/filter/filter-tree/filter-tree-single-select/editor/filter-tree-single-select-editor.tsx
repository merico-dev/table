import { Checkbox, Divider, Group, TextInput } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { CustomDefaultValueEditor } from '~/components/filter/custom-default-value-editor';
import { PickQueryForFilter } from '~/components/filter/pick-query-for-filter';
import { FilterMetaInstance, FilterTreeSingleSelectConfigInstance } from '~/model';
import { ExpectedStructureForTreeSelect } from '../../common/expected-structure';
import { DefaultValueModeSelector } from '~/components/filter/default-value-mode-selector';

type Props = {
  filter: FilterMetaInstance;
};

export const FilterEditorTreeSingleSelect = observer(({ filter }: Props) => {
  const { t } = useTranslation();
  const config = filter.config as FilterTreeSingleSelectConfigInstance;
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
      <PickQueryForFilter value={config.options_query_id} onChange={config.setOptionsQueryID} />
      <Checkbox
        checked={config.default_selection_count === 1}
        onChange={(e) => config.setDefaultSelectionCount(e.currentTarget.checked ? 1 : 0)}
        label={t('filter.widget.tree_single_select.select_first_option_by_default')}
      />
      <DefaultValueModeSelector config={config} />
      <ExpectedStructureForTreeSelect />
    </>
  );
});
