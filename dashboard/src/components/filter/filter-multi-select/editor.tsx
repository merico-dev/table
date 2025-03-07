import {
  ActionIcon,
  Button,
  Center,
  Checkbox,
  Divider,
  Flex,
  Group,
  MultiSelect,
  NumberInput,
  Overlay,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { FilterMetaInstance, FilterMultiSelectConfigInstance } from '~/model';
import { PickQueryForFilter } from '../pick-query-for-filter';
import { ExpectedStructureForSelect } from '../pick-query-for-filter/expected-structure-for-select';
import { CustomDefaultValueEditor } from '../custom-default-value-editor';
import { useTranslation } from 'react-i18next';
import { IconPlaylistAdd, IconTrash } from '@tabler/icons-react';
import { useMemo } from 'react';
import { DefaultValueModeSelector } from '../default-value-mode-selector';

interface IFilterEditorMultiSelect {
  filter: FilterMetaInstance;
}

export const FilterEditorMultiSelect = observer(function _FilterEditorMultiSelect({
  filter,
}: IFilterEditorMultiSelect) {
  const { t } = useTranslation();
  const config = filter.config as FilterMultiSelectConfigInstance;

  const addStaticOption = () => {
    config.addStaticOption({
      label: '',
      value: '',
    });
  };

  const staticOptionFields = config.static_options;
  const validStaticOptions = staticOptionFields.filter((o) => o.value !== '' && o.label !== '');

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
        label={t('filter.widget.select.width')}
        description={t('filter.widget.multi_select.width_description')}
        value={config.min_width}
        onChange={(e) => config.setMinWidth(e.currentTarget.value)}
        placeholder="200px"
      />
      <Divider label={t('filter.widget.select.configure_options')} labelPosition="center" />
      <Stack gap={10} sx={{ position: 'relative', minHeight: '50px' }}>
        {config.usingQuery && (
          <>
            <Overlay
              backgroundOpacity={0.8}
              color="#000"
              sx={{ left: '-5px', right: '-5px', top: '-5px', bottom: '-5px' }}
            />
            <Center sx={{ position: 'absolute', top: 0, left: 0, zIndex: 200, height: '100%', width: '100%' }}>
              <Text c="white" size={'16px'}>
                {t('filter.widget.common.using_query')}
              </Text>
            </Center>
          </>
        )}
        {validStaticOptions.length > 0 && (
          <MultiSelect
            label={t('filter.widget.select.default_selection')}
            placeholder={t('filter.widget.select.no_default_selection')}
            data={validStaticOptions}
            value={[...config.default_value]}
            onChange={config.setDefaultValue}
          />
        )}
        {staticOptionFields.map((_optionField, optionIndex) => (
          <Flex gap={10} key={optionIndex} sx={{ position: 'relative' }} pr="40px">
            <TextInput
              label={t('common.label')}
              required
              value={config.static_options[optionIndex].label}
              onChange={(e) => {
                config.static_options[optionIndex].setLabel(e.currentTarget.value);
              }}
              sx={{ flexGrow: 1 }}
            />
            <TextInput
              label={t('common.value')}
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
              <IconTrash size={16} />
            </ActionIcon>
          </Flex>
        ))}
        <Button
          mt={10}
          size="xs"
          color="blue"
          leftSection={<IconPlaylistAdd size={20} />}
          onClick={addStaticOption}
          sx={{ width: '50%' }}
          mx="auto"
        >
          {t('common.actions.add_an_option')}
        </Button>
      </Stack>
      <Divider label={t('filter.widget.common.or_fetch_options_from_datasource')} labelPosition="center" />
      <PickQueryForFilter value={config.options_query_id} onChange={config.setOptionsQueryID} />
      <NumberInput
        value={config.default_selection_count}
        onChange={config.setDefaultSelectionCount}
        label={t('filter.widget.common.default_selection_count')}
      />
      <DefaultValueModeSelector config={config} />
      <ExpectedStructureForSelect />
    </>
  );
});
