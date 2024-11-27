import { ComboboxItem, Group, Select, SelectProps, Stack, Text } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { filterTypeNames } from '~/components/filter/filter-settings/filter-setting';
import { QueryModelInstance } from '~/dashboard-editor/model';
import { MericoMetricQueryMetaInstance } from '~/model';
import { DashboardFilterType } from '~/types';

const SelectorStyles: SelectProps['styles'] = {
  root: {
    maxWidth: 'unset',
  },
  option: {
    fontFamily: 'monospace',
  },
  input: {
    fontFamily: 'monospace',
  },
  groupLabel: {
    '&::before': {
      content: '""',
      flex: 1,
      insetInline: 0,
      height: 'calc(0.0625rem* var(--mantine-scale))',
      marginInlineEnd: 'var(--mantine-spacing-xs)',
      backgroundColor: 'var(--mantine-color-gray-2)',
    },
  },
};

type CustomOption = ComboboxItem & {
  description: string;
  type: string;
  widget: DashboardFilterType;
  widget_label: string;
};
const renderOption: SelectProps['renderOption'] = ({ option, ...rest }) => {
  const { t } = useTranslation();
  const o = option as CustomOption;
  const showDescription = o.type === 'filter';
  return (
    <Stack
      gap={0}
      py={4}
      styles={{
        root: {
          flexGrow: 1,
          '&[data-selected="true"]': { '.mantine-Text-root': { color: 'white' }, svg: { stroke: 'white' } },
        },
      }}
      {...rest}
    >
      <Group flex="1" gap={4}>
        <Text size="xs">{option.value}</Text>
      </Group>
      {showDescription && (
        <Group justify="space-between" wrap="nowrap">
          <Text size="xs" c={rest.checked ? 'rgba(255,255,255,.8)' : 'dimmed'} style={{ flexShrink: 1, flexGrow: 1 }}>
            {o.widget_label}
          </Text>
          <Text size="xs" c={rest.checked ? 'rgba(255,255,255,.8)' : 'dimmed'} style={{ flexShrink: 0, flexGrow: 0 }}>
            {t(filterTypeNames[o.widget])}
          </Text>
        </Group>
      )}
    </Stack>
  );
};

type Props = {
  queryModel: QueryModelInstance;
  value: string | null;
  onChange: (value: string | null, option: CustomOption) => void;
  usedKeys: Set<string>;
};

export const VariableSelector = observer(({ queryModel, value, onChange, usedKeys }: Props) => {
  const { t } = useTranslation();

  const config = queryModel.config as MericoMetricQueryMetaInstance;

  const options = useMemo(() => {
    const groups = queryModel.getConditionOptionsWithInvalidValue(value).optionGroups;
    return groups.map((optionGroup) => {
      const count = optionGroup.items.length;
      const name = t(optionGroup.group);
      return {
        group: `${name}(${count})`,
        items: optionGroup.items.map((item) => ({
          ...item,
          label: item.value,
          widget_label: item.label,
          disabled: usedKeys.has(item.value),
        })),
      };
    });
  }, [queryModel.getConditionOptionsWithInvalidValue, t, value, usedKeys]);

  const handleChange = useCallback(
    (value: string | null, option: ComboboxItem) => {
      onChange(value, option as CustomOption);
    },
    [onChange],
  );

  return (
    <Select
      size="xs"
      variant="unstyled"
      // searchable
      placeholder="选择变量"
      styles={SelectorStyles}
      data={options}
      renderOption={renderOption}
      maxDropdownHeight={600}
      value={value}
      onChange={handleChange}
      clearable
    />
  );
});
