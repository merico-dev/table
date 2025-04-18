import { Box, Checkbox, Divider, Group, MultiSelect, NumberInput, Select, Stack, Text, TextInput } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import React, { ReactComponentElement, ReactElement, ReactNode, useMemo } from 'react';
import { useEditContentModelContext } from '~/contexts';
import { DashboardFilterType, FilterMetaInstance } from '~/model';
import { FilterEditorCheckbox } from '../filter-checkbox/editor';
import { FilterEditorDateRange } from '../filter-date-range/editor';
import { FilterEditorMultiSelect } from '../filter-multi-select/editor';
import { FilterEditorSelect } from '../filter-select/editor';
import { FilterEditorTextInput } from '../filter-text-input/editor';
import { FilterEditorTreeSelect, FilterEditorTreeSingleSelect } from '../filter-tree/';
import { PreviewFilter } from './preview-filter';
import { useTranslation } from 'react-i18next';

const editors = {
  [DashboardFilterType.Select]: FilterEditorSelect,
  [DashboardFilterType.MultiSelect]: FilterEditorMultiSelect,
  [DashboardFilterType.TreeSelect]: FilterEditorTreeSelect,
  [DashboardFilterType.TreeSingleSelect]: FilterEditorTreeSingleSelect,
  [DashboardFilterType.TextInput]: FilterEditorTextInput,
  [DashboardFilterType.Checkbox]: FilterEditorCheckbox,
  [DashboardFilterType.DateRange]: FilterEditorDateRange,
};

export const filterTypeNames = {
  [DashboardFilterType.Select]: 'filter.widget.names.select',
  [DashboardFilterType.MultiSelect]: 'filter.widget.names.multi_select',
  [DashboardFilterType.TreeSelect]: 'filter.widget.names.tree_select',
  [DashboardFilterType.TreeSingleSelect]: 'filter.widget.names.tree_single_select',
  [DashboardFilterType.TextInput]: 'filter.widget.names.text_input',
  [DashboardFilterType.Checkbox]: 'filter.widget.names.checkbox',
  [DashboardFilterType.DateRange]: 'filter.widget.names.date_range',
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
      { label: t(filterTypeNames[DashboardFilterType.Select]), value: 'select' },
      { label: t(filterTypeNames[DashboardFilterType.MultiSelect]), value: 'multi-select' },
      { label: t(filterTypeNames[DashboardFilterType.TreeSelect]), value: 'tree-select' },
      { label: t(filterTypeNames[DashboardFilterType.TreeSingleSelect]), value: 'tree-single-select' },
      { label: t(filterTypeNames[DashboardFilterType.TextInput]), value: 'text-input' },
      { label: t(filterTypeNames[DashboardFilterType.Checkbox]), value: 'checkbox' },
      { label: t(filterTypeNames[DashboardFilterType.DateRange]), value: 'date-range' },
    ];
  }, [i18n.language]);

  return (
    <Group grow gap={20} align="top">
      <Box w={600}>
        <Text pb="md" c="gray" size="sm">
          {t('common.titles.edit')}
        </Text>
        <Stack>
          <Group wrap="nowrap">
            <NumberInput
              label={t('filter.field.order')}
              required
              value={filter.order}
              onChange={filter.setOrder}
              hideControls
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
