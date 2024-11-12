import { ActionIcon, ComboboxItem, Group, Select, Text, Stack, ThemeIcon, Tooltip, SelectProps } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { QueryModelInstance } from '~/dashboard-editor/model';
import { MericoIconExternalLink } from './merico-icons';
import { showNotification } from '@mantine/notifications';
import { IconHash } from '@tabler/icons-react';
import { ErrorBoundary } from '~/utils';

type CustomOption = ComboboxItem & { description: string };
const renderSelectOption: SelectProps['renderOption'] = ({ option, ...rest }) => {
  const o = option as CustomOption;
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
        <IconHash size={12} />
        <Text size="xs">{o.label}</Text>
      </Group>
      <Text ml={16} size="xs" c={rest.checked ? 'rgba(255,255,255,.8)' : 'dimmed'}>
        {o.description}
      </Text>
    </Stack>
  );
};

const mockOptions = [
  {
    label: '项目的重点问题数（aspect）',
    value: '项目的重点问题数（aspect）',
    description: '代码提交的最终提交时间。',
  },
  { label: '衍生指标1', value: '衍生指标1', description: '代码提交的最终提交时间。' },
  { label: '衍生指标2', value: '衍生指标2', description: '代码提交的最终提交时间。' },
  { label: '衍生指标3', value: '衍生指标3', description: '代码提交的最终提交时间。' },
  { label: '项目的新增代码当量', value: '项目的新增代码当量', description: '代码提交的最终提交时间。' },
  { label: '衍生指标4', value: '衍生指标4', description: '代码提交的最终提交时间。' },
  { label: '衍生指标5', value: '衍生指标5', description: '代码提交的最终提交时间。' },
  { label: '衍生指标6', value: '衍生指标6', description: '代码提交的最终提交时间。' },
];

type Props = {
  queryModel: QueryModelInstance;
};

export const SelectMetric = observer(({ queryModel }: Props) => {
  return (
    <ErrorBoundary>
      <Group justify="flex-end" gap={4} align="flex-end">
        <Select
          size="xs"
          label="指标"
          data={mockOptions}
          renderOption={renderSelectOption}
          styles={{ root: { flexGrow: 1 } }}
          maxDropdownHeight={500}
        />
        <Tooltip label="跳转到指标明细页查看详情。">
          <ActionIcon
            size="md"
            variant="subtle"
            mb={2}
            onClick={() => showNotification({ message: 'TODO', color: 'red' })}
          >
            <MericoIconExternalLink width={14} height={14} />
          </ActionIcon>
        </Tooltip>
      </Group>
    </ErrorBoundary>
  );
});
