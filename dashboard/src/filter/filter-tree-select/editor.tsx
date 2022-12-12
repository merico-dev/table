import { Checkbox, Divider, TextInput } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { IFilterConfig_TreeSelect } from '../../model/filters/filter/tree-select';
import { PickQueryForFilter } from '../pick-query-for-filter';
import { ExpectedStructureForTreeSelect } from '../pick-query-for-filter/expected-structure-for-tree-select';

interface IFilterEditorTreeSelect {
  config: IFilterConfig_TreeSelect;
}

export const FilterEditorTreeSelect = observer(function _FilterEditorTreeSelect({ config }: IFilterEditorTreeSelect) {
  return (
    <>
      <TextInput
        label="Min-width"
        value={config.min_width}
        onChange={(e) => config.setMinWidth(e.currentTarget.value)}
        placeholder="200px"
      />
      <Divider label="Fetch options from database" labelPosition="center" />
      <Checkbox
        checked={config.select_first_by_default}
        onChange={(e) => config.setSelectFirstByDefault(e.currentTarget.checked)}
        label="Select the first option by default"
      />
      <PickQueryForFilter value={config.options_query_id} onChange={config.setOptionsQueryID} />
      <ExpectedStructureForTreeSelect />
    </>
  );
});
