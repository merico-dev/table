import { Checkbox, Divider, Group, NumberInput, TextInput } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { FilterMetaInstance, FilterTreeSelectConfigInstance } from '~/model';
import { PickQueryForFilter } from '../pick-query-for-filter';
import { ExpectedStructureForTreeSelect } from './expected-structure';
import { CustomDefaultValueEditor } from '../custom-default-value-editor';

interface IFilterEditorTreeSelect {
  filter: FilterMetaInstance;
}

export const FilterEditorTreeSelect = observer(function _FilterEditorTreeSelect({ filter }: IFilterEditorTreeSelect) {
  const config = filter.config as FilterTreeSelectConfigInstance;
  return (
    <>
      <Group position="apart">
        <Checkbox
          checked={config.required}
          onChange={(e) => config.setRequired(e.currentTarget.checked)}
          label="Required"
        />
        <CustomDefaultValueEditor filter={filter} />
      </Group>
      <TextInput
        label="Min-width"
        value={config.min_width}
        onChange={(e) => config.setMinWidth(e.currentTarget.value)}
        placeholder="200px"
      />
      <Divider label="Fetch options from database" labelPosition="center" />
      <Checkbox
        checked={config.treeCheckStrictly}
        onChange={(e) => config.setTreeCheckStrictly(e.currentTarget.checked)}
        label="Parent and children nodes are not associated"
      />
      <NumberInput
        value={config.default_selection_count}
        onChange={config.setDefaultSelectionCount}
        label="Select first N options by default"
      />
      <PickQueryForFilter value={config.options_query_id} onChange={config.setOptionsQueryID} />
      <ExpectedStructureForTreeSelect />
    </>
  );
});
