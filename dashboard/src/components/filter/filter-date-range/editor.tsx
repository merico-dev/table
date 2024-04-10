import { Checkbox, Group, NumberInput, Select, Stack, Text } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { FilterDateRangeConfigInstance, FilterMetaInstance } from '~/model';
import { FilterDateRange } from './render';
import { useMemo } from 'react';
import { getDateRangeShortcuts } from './widget/shortcuts/shortcuts';
import { CustomDefaultValueEditor } from '../custom-default-value-editor';
import { useTranslation } from 'react-i18next';

interface IFilterEditorDateRange {
  filter: FilterMetaInstance;
}

const inputFormatOptions = [
  { label: '2022', value: 'YYYY' },
  { label: '202201', value: 'YYYYMM' },
  { label: '20220101', value: 'YYYYMMDD' },
  { label: '2022-01', value: 'YYYY-MM' },
  { label: '2022-01-01', value: 'YYYY-MM-DD' },
];

export const FilterEditorDateRange = observer(function _FilterEditorDateRange({ filter }: IFilterEditorDateRange) {
  const { t } = useTranslation();
  const config = filter.config as FilterDateRangeConfigInstance;

  const shortcuts = useMemo(
    () =>
      getDateRangeShortcuts().map(({ key, value, group }) => ({
        label: t(`filter.widget.date_range.shortcut.${group}.full.${key}`),
        value,
        group: t(`filter.widget.date_range.shortcut.${group}.label`),
      })),
    [],
  );
  return (
    <>
      <Group>
        <Checkbox
          checked={config.required}
          onChange={(e) => config.setRequired(e.currentTarget.checked)}
          label={t('filter.widget.date_range.required')}
        />
        <Checkbox
          checked={config.allowSingleDateInRange}
          onChange={(e) => config.setAllowSingleDateInRange(e.currentTarget.checked)}
          label={t('filter.widget.date_range.allow_single_date')}
        />
      </Group>
      <Group grow>
        <Select
          data={inputFormatOptions}
          label={t('filter.widget.date_range.display_format')}
          value={config.inputFormat}
          onChange={config.setInputFormat}
        />
        <NumberInput
          label={t('filter.widget.date_range.max_days')}
          min={0}
          value={config.max_days}
          onChange={config.setMaxDays}
          hideControls
        />
      </Group>
      <Group>
        <FilterDateRange
          label={t('filter.widget.date_range.default_value')}
          config={config}
          // @ts-expect-error type of default_value
          value={config.default_value}
          onChange={config.setDefaultValue}
          disabled={!!config.default_shortcut}
        />
        <Select
          data={shortcuts}
          label={t('filter.widget.date_range.default_by_shortcut')}
          value={config.default_shortcut}
          onChange={config.setDefaultShortcut}
          placeholder={t('filter.widget.date_range.default_by_shortcut_placeholder')}
          clearable
          sx={{ flexGrow: 1 }}
          maxDropdownHeight={500}
        />
      </Group>
      <CustomDefaultValueEditor filter={filter} />
    </>
  );
});
