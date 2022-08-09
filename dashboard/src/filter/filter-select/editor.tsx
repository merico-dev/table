import { ActionIcon, Button, Checkbox, Divider, Group, Select, Text, TextInput } from '@mantine/core';
import { PlaylistAdd, Trash } from 'tabler-icons-react';
import { IFilterConfig_Select } from '../../model/filter/select';
import { FilterQueryField } from '../filter-query-field';

interface IFilterEditorSelect {
  config: IFilterConfig_Select;
}

export function FilterEditorSelect({ config }: IFilterEditorSelect) {
  const addStaticOption = () => {
    config.addStaticOption({
      label: '',
      value: '',
    });
  };

  const staticOptionFields = config.static_options;

  const optionsForDefaultValue = [{ label: 'No default selection', value: '' }, ...staticOptionFields];

  return (
    <>
      <Checkbox checked={config.required} onChange={(e) => console.log(e.currentTarget.checked)} label="Required" />
      <Divider label="Configure options" labelPosition="center" />
      {staticOptionFields.length > 0 && (
        <Select
          label="Default Selection"
          data={optionsForDefaultValue}
          value={config.default_value}
          onChange={console.log}
        />
      )}
      {staticOptionFields.map((_optionField, optionIndex) => (
        <Group sx={{ position: 'relative' }} pr="40px">
          <TextInput
            label="Label"
            required
            value={config.static_options[optionIndex].label}
            onChange={console.log}
            sx={{ flexGrow: 1 }}
          />
          <TextInput
            label="Value"
            required
            value={config.static_options[optionIndex].value}
            onChange={console.log}
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
      <FilterQueryField value={config.options_query} onChange={console.log} />
    </>
  );
}
