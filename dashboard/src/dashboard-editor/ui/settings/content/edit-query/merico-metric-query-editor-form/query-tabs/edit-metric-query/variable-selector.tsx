import { ComboboxItem, Group, Select, SelectProps, Stack, Text } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { filterTypeNames } from '~/components/filter/filter-settings/filter-setting';
import { QueryModelInstance } from '~/dashboard-editor/model';
import { DashboardFilterType } from '~/types';

const SelectorStyles: SelectProps['styles'] = {
  option: {
    fontFamily: 'monospace',
  },
  input: { border: 'none' },
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

type CustomOption = ComboboxItem & { description: string; type: string; widget: DashboardFilterType };
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
        <Group justify="space-between">
          <Text size="xs" c={rest.checked ? 'rgba(255,255,255,.8)' : 'dimmed'}>
            {o.label}
          </Text>
          <Text size="xs" c={rest.checked ? 'rgba(255,255,255,.8)' : 'dimmed'}>
            {t(filterTypeNames[o.widget])}
          </Text>
        </Group>
      )}
    </Stack>
  );
};

type Props = {
  queryModel: QueryModelInstance;
};

export const VariableSelector = observer(({ queryModel }: Props) => {
  const { t } = useTranslation();
  const [value, setValue] = useState<string[]>([]);
  const options = useMemo(() => {
    return queryModel.conditionOptions.map((optionGroup) => {
      const count = optionGroup.items.length;
      const name = t(optionGroup.group);
      optionGroup.group = `${name}(${count})`;
      return optionGroup;
    });
  }, [queryModel.conditionOptions, t]);
  return (
    <Select
      size="xs"
      searchable
      placeholder="选择变量"
      defaultDropdownOpened
      styles={SelectorStyles}
      data={options}
      renderOption={renderOption}
      maxDropdownHeight={600}
    />
  );
});
