import { ComboboxItem, Group, MultiSelect, SelectProps, Stack, Text } from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';
import { observer } from 'mobx-react-lite';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useEditContentModelContext } from '~/contexts';

// duplicate from filter-setting.tsx
// to avoid vitest break
const filterTypeNames = {
  select: 'filter.widget.names.select',
  'multi-select': 'filter.widget.names.multi_select',
  'tree-select': 'filter.widget.names.tree_select',
  'tree-single-select': 'filter.widget.names.tree_single_select',
  'text-input': 'filter.widget.names.text_input',
  checkbox: 'filter.widget.names.checkbox',
  'date-range': 'filter.widget.names.date_range',
};

type CustomOption = ComboboxItem & {
  description: string;
  type: string;
  widget: 'date-range' | 'select' | 'multi-select' | 'tree-select' | 'tree-single-select' | 'text-input' | 'checkbox'; // cant use DashboardFilterType or vitest breaks
  widget_label: string;
};
const renderOption: SelectProps['renderOption'] = ({ option, checked, ...rest }) => {
  const { t } = useTranslation();
  const o = option as CustomOption;
  const showDescription = o.type === 'filter';
  return (
    <Group gap={4} flex={1}>
      <IconCheck size={14} opacity={checked ? 1 : 0} color="black" />
      <Stack
        gap={0}
        py={4}
        px={8}
        flex={1}
        styles={{
          root: {
            flexGrow: 1,
            borderRadius: '4px',
          },
        }}
        {...rest}
      >
        <Group justify="space-between" wrap="nowrap">
          <Text size="xs">{option.label}</Text>
          {showDescription && (
            <Text size="xs" c={checked ? 'rgba(0,0,0,.8)' : 'dimmed'} style={{ flexShrink: 0, flexGrow: 0 }}>
              {t(filterTypeNames[o.widget])}
            </Text>
          )}
        </Group>
      </Stack>
    </Group>
  );
};

type Props = {
  value: string[];
  onChange: (value: string[]) => void;
  disabled: boolean;
};

export const DashboardStateVariableSelector = observer(({ value, onChange, disabled }: Props) => {
  const { t } = useTranslation();
  const contentModel = useEditContentModelContext();
  const dashboardStateVariableOptions = contentModel.dashboardStateVariableOptions;

  const options = useMemo(() => {
    const { optionGroups, validValues } = dashboardStateVariableOptions;
    const ret: { group: string; items: any[] }[] = optionGroups.map((optionGroup) => {
      return {
        group: t(optionGroup.group),
        items: optionGroup.items.map((item) => ({
          ...item,
          label: item.label,
          value: item.value,
          widget_label: item.label,
        })),
      };
    });
    const invalidGroupItems = value
      .filter((v) => !validValues.has(v))
      .map((v) => {
        return {
          label: v,
          value: v,
          disabled: true,
        };
      });
    if (invalidGroupItems.length > 0) {
      ret.push({
        group: t('common.invalid'),
        items: invalidGroupItems,
      });
    }

    return ret;
  }, [dashboardStateVariableOptions, t, value]);

  return (
    <MultiSelect
      size="xs"
      label={t('viz.vizDashboardState.variable_selector.label')}
      // searchable
      placeholder={value.length === 0 ? t('viz.vizDashboardState.variable_selector.placeholder') : undefined}
      // styles={SelectorStyles}
      data={options}
      renderOption={renderOption}
      maxDropdownHeight={600}
      value={value}
      onChange={onChange}
      disabled={disabled}
      clearable
    />
  );
});
