import {
  ActionIcon,
  Button,
  Center,
  Checkbox,
  Divider,
  Flex,
  Overlay,
  Select,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { PlaylistAdd, Trash } from 'tabler-icons-react';
import { IFilterConfig_Select } from '~/dashboard-editor/model/filters/filter/select';
import { PickQueryForFilter } from '../pick-query-for-filter';
import { ExpectedStructureForSelect } from '../pick-query-for-filter/expected-structure-for-select';

interface IFilterEditorSelect {
  config: IFilterConfig_Select;
}

export const FilterEditorSelect = observer(function _FilterEditorSelect({ config }: IFilterEditorSelect) {
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
      <Checkbox
        checked={config.required}
        onChange={(e) => config.setRequired(e.currentTarget.checked)}
        label="Required"
      />
      <TextInput
        label="Width"
        value={config.width}
        onChange={(e) => config.setWidth(e.currentTarget.value)}
        placeholder="200px"
      />
      <Divider label="Configure options" labelPosition="center" />
      <Stack spacing={10} sx={{ position: 'relative', minHeight: '50px' }}>
        {config.usingQuery && (
          <>
            <Overlay opacity={0.8} color="#000" sx={{ left: '-5px', right: '-5px', top: '-5px', bottom: '-5px' }} />
            <Center sx={{ position: 'absolute', top: 0, left: 0, zIndex: 200, height: '100%', width: '100%' }}>
              <Text color="white" size={16}>
                Using query
              </Text>
            </Center>
          </>
        )}
        {staticOptionFields.length > 0 && (
          <Select
            label="Default Selection"
            data={optionsForDefaultValue}
            value={config.default_value}
            onChange={config.setDefaultValue}
          />
        )}
        {staticOptionFields.map((_optionField, optionIndex) => (
          <Flex gap={10} key={optionIndex} sx={{ position: 'relative' }} pr="40px">
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
          </Flex>
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
      </Stack>
      <Divider label="Or fetch options from database" labelPosition="center" />
      <Checkbox
        checked={config.default_selection_count === 1}
        onChange={(e) => config.setDefaultSelectionCount(e.currentTarget.checked ? 1 : 0)}
        label="Select the first option by default"
      />
      <PickQueryForFilter value={config.options_query_id} onChange={config.setOptionsQueryID} />
      <ExpectedStructureForSelect />
    </>
  );
});
