import { Checkbox, Group, Select } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { observer } from 'mobx-react-lite';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { DateRangeValue_Value, FilterMericoDateRangeConfigInstance, FilterMetaInstance } from '~/model';
import { CustomDefaultValueEditor } from '../custom-default-value-editor';
import { SelectStep } from './widget/select-step';
import { getMericoShortcutsInGroups } from './widget/shortcuts/shortcuts';

type Props = {
  filter: FilterMetaInstance;
};

export const FilterEditorMericoDateRange = observer(({ filter }: Props) => {
  const { t } = useTranslation();
  const config = filter.config as FilterMericoDateRangeConfigInstance;
  const shortcuts = useMemo(() => {
    const shortcutsInGroups = getMericoShortcutsInGroups(config.default_step);
    return Object.entries(shortcutsInGroups).map(([group, items]) => {
      return {
        group: t(`filter.widget.date_range.shortcut.${group}.label`),
        items: items.map(({ key, value }) => ({
          label: t(`filter.widget.date_range.shortcut.${group}.full.${key}`),
          value,
        })),
      };
    });
  }, [config.default_step]);

  const defaultValue = [...config.default_value] as DateRangeValue_Value;
  const handleDefaultValueChange = (newValue: DateRangeValue_Value) => {
    config.setDefaultValue({
      value: newValue, // TODO: use step
      shortcut: null,
      step: config.default_step,
    });
    config.setDefaultShortcut(null);
  };

  const handleShortcutChange = (shortcut: string | null) => {
    config.setDefaultValue({
      value: [null, null],
      shortcut,
      step: config.default_step,
    });
    config.setDefaultShortcut(shortcut);
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
      <SelectStep value={config.default_step} onChange={config.setDefaultStep} label="默认步长" />

      <Group>
        <Select
          data={shortcuts}
          label={t('filter.widget.date_range.default_by_shortcut')}
          value={config.default_shortcut}
          onChange={handleShortcutChange}
          placeholder={t('filter.widget.date_range.default_by_shortcut_placeholder')}
          clearable
          sx={{ flexGrow: 1 }}
          maxDropdownHeight={500}
        />
        <DatePickerInput
          type="range"
          label={t('filter.widget.date_range.default_value')}
          value={defaultValue}
          onChange={handleDefaultValueChange}
          valueFormat={config.inputFormat}
          required={config.required}
          allowSingleDateInRange
          numberOfColumns={2}
          w="50%"
          disabled={!!config.default_shortcut}
        />
      </Group>
      <CustomDefaultValueEditor filter={filter} />
    </>
  );
});
