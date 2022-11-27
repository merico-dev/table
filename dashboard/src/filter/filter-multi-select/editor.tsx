import { ActionIcon, Button, Checkbox, Divider, Group, MultiSelect, TextInput } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { PlaylistAdd, Trash } from 'tabler-icons-react';
import { IFilterConfig_MultiSelect } from '../../model/filters/filter/multi-select';
import { PickQueryForFilter } from '../pick-query-for-filter';
import { ExpectedStructureForSelect } from '../pick-query-for-filter/expected-structure-for-select';

interface IFilterEditorMultiSelect {
  config: IFilterConfig_MultiSelect;
}

export const FilterEditorMultiSelect = observer(function _FilterEditorMultiSelect({
  config,
}: IFilterEditorMultiSelect) {
  const addStaticOption = () => {
    config.addStaticOption({
      label: '',
      value: '',
    });
  };

  const staticOptionFields = config.static_options;

  const optionsForDefaultValue = [...staticOptionFields];
  return (
    <>
      <Divider label="Configure options" labelPosition="center" />
      {staticOptionFields.length > 0 && (
        <MultiSelect
          label="Default Selection"
          data={optionsForDefaultValue}
          value={config.default_value}
          onChange={config.setDefaultValue}
        />
      )}
      {staticOptionFields.map((_optionField, optionIndex) => (
        <Group sx={{ position: 'relative' }} pr="40px">
          <TextInput
            label="Label"
            required
            value={config.static_options[optionIndex].label}
            onChange={(e) => {
              config.static_options[optionIndex].setLabel(e.currentTarget.value);
            }}
            sx={{ flexGrow: 1 }}
          />
          <TextInput
            label="Value"
            required
            value={config.static_options[optionIndex].value}
            onChange={(e) => {
              config.static_options[optionIndex].setValue(e.currentTarget.value);
            }}
            sx={{ flexGrow: 1 }}
          />
          <ActionIcon
            color="red"
            variant="subtle"
            onClick={() => config.removeStaticOption(optionIndex)}
            sx={{ position: 'absolute', top: 28, right: 5 }}
          >
            <Trash size={16} />
          </ActionIcon>
        </Group>
      ))}
      <Button
        size="xs"
        color="blue"
        leftIcon={<PlaylistAdd size={20} />}
        onClick={addStaticOption}
        sx={{ width: '50%' }}
        mx="auto"
      >
        Add an Option
      </Button>
      <Divider label="Or fetch options from database" labelPosition="center" />
      <Checkbox
        checked={config.select_first_by_default}
        onChange={(e) => config.setSelectFirstByDefault(e.currentTarget.checked)}
        label="Select the first option by default"
      />
      <PickQueryForFilter value={config.options_query_id} onChange={config.setOptionsQueryID} />
      <ExpectedStructureForSelect />
    </>
  );
});
