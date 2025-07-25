import { Checkbox, Group, Select } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { DateRangeValue, DateRangeValue_Value, FilterMericoDateRangeConfigInstance, FilterMetaInstance } from '~/model';
import { CustomDefaultValueEditor } from '../custom-default-value-editor';
import { FilterMericoDateRange } from './render';
import { getMericoShortcutsInGroups } from './widget/shortcuts/shortcuts';
import { FilterDateRange } from '../filter-date-range/render';
import { FilterDateRangeForEditorField } from '../filter-date-range/filter-date-range-for-editor-field';

type Props = {
  filter: FilterMetaInstance;
};

export const FilterEditorMericoDateRange = observer(({ filter }: Props) => {
  const { t } = useTranslation();
  const config = filter.config as FilterMericoDateRangeConfigInstance;
  const shortcuts = useMemo(() => {
    const shortcutsInGroups = getMericoShortcutsInGroups();
    return Object.entries(shortcutsInGroups).map(([group, items]) => {
      return {
        group: t(`filter.widget.date_range.shortcut.${group}.label`),
        items: items.map(({ key, value }) => ({
          label: t(`filter.widget.date_range.shortcut.${group}.full.${key}`),
          value,
        })),
      };
    });
  }, []);

  const defaultValue = [...config.default_value] as DateRangeValue_Value;
  const handleDefaultValueChange = (v: DateRangeValue) => {
    config.setDefaultValue({
      ...v,
      step: config.default_step,
    });
  };
  return (
    <>
      <Group>
        <Checkbox
          checked={config.required}
          onChange={(e) => config.setRequired(e.currentTarget.checked)}
          label={t('filter.widget.date_range.required')}
        />
      </Group>
      <Group>
        <FilterDateRangeForEditorField
          label={t('filter.widget.date_range.default_value')}
          value={{ value: defaultValue, shortcut: null }}
          onChange={handleDefaultValueChange}
          disabled={!!config.default_shortcut}
          inputFormat={config.inputFormat}
          required={config.required}
          max_days={0}
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
