import { ComboboxLikeRenderOptionInput, Group, Select, SelectProps, Stack, Text } from '@mantine/core';
import _ from 'lodash';
import { observer } from 'mobx-react-lite';
import { useMemo } from 'react';
import { QueryModelInstance } from '~/dashboard-editor/model';
import { DimensionIcon } from './dimension-icon/dimension-icon';
import { DimensionOption } from './type';

const data: DimensionOption[] = [
  {
    label: 'dev_eq',
    value: 'dev_eq',
    description: '代码提交的代码当量。',
    type: 'number',
  },
  {
    label: 'some_num',
    value: 'some_num',
    description: '代码提交的代码当量。',
    type: 'number',
  },
  {
    label: 'commit_hash',
    value: 'commit_hash',
    description: '代码提交的代码当量。',
    type: 'string',
  },
  {
    label: 'commit_author_time',
    value: 'commit_author_time',
    description: '代码提交的创作时间。',
    type: 'date',
  },
  {
    label: 'commit_commit_time',
    value: 'commit_commit_time',
    description: '代码提交的最终提交时间。',
    type: 'date',
  },
  {
    label: 'is_latest',
    value: 'is_latest',
    description: '是否是最新纪录',
    type: 'boolean',
  },
  {
    label: 'account -> id',
    value: 'account -> id',
    description: '系统账号的ID。',
    type: 'string',
    group_name: '系统账号',
    group_value: 'account',
  },
  {
    label: 'account -> user_type',
    value: 'account -> user_type',
    description: '用户的类型。',
    type: 'string',
    group_name: '系统账号',
    group_value: 'account',
  },
  {
    label: 'account -> is_enabled',
    value: 'account -> is_enabled',
    description: '账号是否处于激活状态',
    type: 'boolean',
    group_name: '系统账号',
    group_value: 'account',
  },
];

const typeNames: Record<string, string> = {
  string: '维度列',
  number: '数值列',
  date: '数值列',
  boolean: '维度列',
};

const options = Object.entries(
  _.groupBy(data, (item) => {
    if ('group_name' in item) {
      return '扩展维度';
    }
    return typeNames[item.type];
  }),
).map(([group, items]) => ({
  group: `${group}(${items.length})`,
  items,
}));

const renderOption = ({ option, checked }: ComboboxLikeRenderOptionInput<any>) => {
  const o = option as DimensionOption;
  return (
    <Stack gap={1}>
      <Group gap={4}>
        <DimensionIcon type={o.type} />
        <Text size="xs">{o.label}</Text>
      </Group>
      <Text size="xs" c="dimmed" pl={18}>
        {o.description}
      </Text>
    </Stack>
  );
};

type DimensionSelectorProps = {
  queryModel: QueryModelInstance;
  value: string | null;
  onChange: (v: string | null) => void;
  label?: string;
};
export const DimensionSelector = observer(({ queryModel, label, value, onChange }: DimensionSelectorProps) => {
  const DimensionSelectorStyles = useMemo(
    () => ({
      root: {
        maxWidth: 'unset',
      },
      option: {
        fontFamily: 'monospace',
      },
      section: {
        '&[data-position="left"]': {
          width: label ? '70px' : '0px',
          justifyContent: 'flex-start',
        },
      },
      input: {
        paddingInlineStart: label ? '70px' : 'var(--input-padding-inline-start)',
        color: 'gray',
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
    }),
    [label],
  );

  return (
    <Select
      size="xs"
      variant="unstyled"
      leftSection={
        label ? (
          <Text size="sm" c="black">
            {label}
          </Text>
        ) : null
      }
      styles={DimensionSelectorStyles}
      value={value}
      onChange={onChange}
      data={options}
      maxDropdownHeight={600}
      renderOption={renderOption}
    />
  );
});
