import { Checkbox, Group, NumberInput, Select } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { DateRangeValue_Value, FilterDateRangeConfigInstance, FilterMetaInstance } from '~/model';
import { CustomDefaultValueEditor } from '../custom-default-value-editor';
import { FilterDateRange } from './render';
import { getShortcutsInGroups } from './widget/shortcuts/shortcuts';

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
  const shortcuts = useMemo(() => {
    const shortcutsInGroups = getShortcutsInGroups();
    return Object.entries(shortcutsInGroups).map(([group, items]) => {
      console.log(group, items);
      return {
        group: t(`filter.widget.date_range.shortcut.${group}.label`),
        items: items.map(({ key, value }) => ({
          label: t(`filter.widget.date_range.shortcut.${group}.full.${key}`),
          value,
        })),
      };
    });
  }, []);

  console.log(shortcuts);

  const defaultValue = [...config.default_value] as DateRangeValue_Value;
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
          value={{ value: defaultValue, shortcut: null }}
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
