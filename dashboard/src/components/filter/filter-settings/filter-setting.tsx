import { Box, Checkbox, Divider, Group, MultiSelect, NumberInput, Select, Stack, Text, TextInput } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import React, { useMemo } from 'react';
import { useEditContentModelContext } from '~/contexts';
import { FilterMetaInstance } from '~/model';
import { FilterEditorCheckbox } from '../filter-checkbox/editor';
import { FilterEditorDateRange } from '../filter-date-range/editor';
import { FilterEditorMultiSelect } from '../filter-multi-select/editor';
import { FilterEditorSelect } from '../filter-select/editor';
import { FilterEditorTextInput } from '../filter-text-input/editor';
import { FilterEditorTreeSelect } from '../filter-tree-select/editor';
import { PreviewFilter } from './preview-filter';
import { useTranslation } from 'react-i18next';

const editors = {
  select: FilterEditorSelect,
  'multi-select': FilterEditorMultiSelect,
  'tree-select': FilterEditorTreeSelect,
  'text-input': FilterEditorTextInput,
  checkbox: FilterEditorCheckbox,
  'date-range': FilterEditorDateRange,
};

export const filterTypeNames = {
  select: 'filter.widget.names.select',
  'multi-select': 'filter.widget.names.multi_select',
  'tree-select': 'filter.widget.names.tree_select',
  'text-input': 'filter.widget.names.text_input',
  checkbox: 'filter.widget.names.checkbox',
  'date-range': 'filter.widget.names.date_range',
};

interface IFilterSetting {
  filter: FilterMetaInstance;
}

export const FilterSetting = observer(function _FilterSetting({ filter }: IFilterSetting) {
  const { t, i18n } = useTranslation();
  const model = useEditContentModelContext();
  const FilterEditor = React.useMemo(() => {
    return editors[filter.type];
  }, [filter.type]);

  const filterTypeOptions = useMemo(() => {
    return [
      { label: t(filterTypeNames['select']), value: 'select' },
      { label: t(filterTypeNames['multi-select']), value: 'multi-select' },
      { label: t(filterTypeNames['tree-select']), value: 'tree-select' },
      { label: t(filterTypeNames['text-input']), value: 'text-input' },
      { label: t(filterTypeNames['checkbox']), value: 'checkbox' },
      { label: t(filterTypeNames['date-range']), value: 'date-range' },
    ];
  }, [i18n.language]);

  return (
    <Group grow spacing={20} align="top">
      <Box sx={{ maxWidth: '600px' }}>
        <Text pb="md" color="gray">
          {t('common.titles.edit')}
        </Text>
        <Stack>
          <Group noWrap>
            <NumberInput
              label={t('filter.field.order')}
              required
              value={filter.order}
              onChange={filter.setOrder}
              hideControls
              // @ts-expect-error important
              sx={{ flexGrow: '1 !important' }}
            />
            {filter.auto_submit_supported && (
              <Checkbox
                label={t('filter.field.auto_submit')}
                checked={filter.auto_submit}
                onChange={(e) => filter.setAutoSubmit(e.currentTarget.checked)}
                mt={22}
              />
            )}
          </Group>
          <MultiSelect
            label={t('filter.field.visible_in')}
            data={model.views.options}
            value={[...filter.visibleInViewsIDs]}
            onChange={filter.setVisibleInViewsIDs}
          />
          <TextInput
            label={t('common.key')}
            placeholder={t('filter.field.key_placeholder')}
            required
            value={filter.key}
            onChange={(e) => {
              filter.setKey(e.currentTarget.value);
            }}
          />
          <TextInput
            label={t('common.label')}
            placeholder={t('filter.field.label_placeholder')}
            required
            value={filter.label}
            onChange={(e) => {
              filter.setLabel(e.currentTarget.value);
            }}
          />
          <Select
            label={t('filter.field.widget')}
            data={filterTypeOptions}
            required
            value={filter.type}
            onChange={filter.setType}
            maxDropdownHeight={500}
          />
          <Divider mb={0} mt={10} variant="dashed" labelPosition="center" />

          <FilterEditor filter={filter} />
        </Stack>
      </Box>
      <PreviewFilter filter={filter} />
    </Group>
  );
});
