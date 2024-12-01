import { Center, Checkbox, Divider, Group, Overlay, Stack, Text, TextInput } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { FilterMetaInstance, FilterSelectConfigInstance } from '~/model';
import { CustomDefaultValueEditor } from '../../custom-default-value-editor';
import { PickQueryForFilter } from '../../pick-query-for-filter';
import { ExpectedStructureForSelect } from '../../pick-query-for-filter/expected-structure-for-select';
import { StaticOptions } from './static-options';

type Props = {
  filter: FilterMetaInstance;
};

export const FilterEditorSelect = observer(({ filter }: Props) => {
  const { t } = useTranslation();
  const config = filter.config as FilterSelectConfigInstance;

  return (
    <>
      <Group justify="space-between">
        <Checkbox
          checked={config.required}
          onChange={(e) => config.setRequired(e.currentTarget.checked)}
          label={t('filter.widget.select.required')}
        />
        <Checkbox
          checked={config.clearable}
          onChange={(e) => config.setClearable(e.currentTarget.checked)}
          label={t('filter.widget.select.clearable')}
        />
        <CustomDefaultValueEditor filter={filter} />
      </Group>
      <TextInput
        label={t('filter.widget.select.width')}
        value={config.width}
        onChange={(e) => config.setWidth(e.currentTarget.value)}
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
        <StaticOptions config={config} />
      </Stack>
      <Divider label={t('filter.widget.common.or_fetch_options_from_datasource')} labelPosition="center" />
      <Checkbox
        checked={config.default_selection_count === 1}
        onChange={(e) => config.setDefaultSelectionCount(e.currentTarget.checked ? 1 : 0)}
        label={t('filter.widget.select.select_first_option_by_default')}
      />
      <PickQueryForFilter value={config.options_query_id} onChange={config.setOptionsQueryID} />
      <ExpectedStructureForSelect />
    </>
  );
});
