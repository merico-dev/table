import { Button, Group, Table, Text, Tooltip } from '@mantine/core';
import { IconDeviceFloppy, IconRecycle } from '@tabler/icons-react';
import { toJS } from 'mobx';
import { observer } from 'mobx-react-lite';
import { IResolveResult, MergeJsonDocsState } from './merge-json-docs-state';

interface IApplyButton {
  state: MergeJsonDocsState;
  onApply?: (resolveList: IResolveResult[]) => void;
}

const ApplyButton = observer(({ state, onApply }: IApplyButton) => {
  const handleApply = () => {
    onApply?.(Array.from(state.resolvedDifferences.values()).map((it) => toJS(it)));
  };
  return (
    <Tooltip
      label={
        <Table
          sx={{
            color: 'white',
            'th, td': { textAlign: 'left' },
            'tbody tr th': { paddingRight: '10px' },
            'tr:not(:first-of-type)': { 'th, td': { borderTop: '1px solid #dee2e6' } },
          }}
        >
          <Table.Tbody>
            <Table.Tr>
              <Table.Th>Pending changes</Table.Th>
              <Table.Td>{state.resolvedDifferences.size}</Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Th>Total changes</Table.Th>
              <Table.Td>{state.differences.length}</Table.Td>
            </Table.Tr>
          </Table.Tbody>
        </Table>
      }
    >
      {state.canApply ? (
        <Button
          size="xs"
          color="green"
          variant="filled"
          leftSection={<IconDeviceFloppy size={14} />}
          onClick={handleApply}
        >
          Apply
        </Button>
      ) : (
        <Button
          size="xs"
          color="gray"
          variant="filled"
          leftSection={<IconDeviceFloppy size={14} />}
          sx={{ cursor: 'not-allowed', transform: 'none !important' }}
        >
          Apply ({state.resolvedDifferences.size} / {state.differences.length})
        </Button>
      )}
    </Tooltip>
  );
});

export interface IMergerModalTitle {
  state: MergeJsonDocsState;
  onApply?: (resolveList: IResolveResult[]) => void;
}

export const MergerModalTitle = observer(({ state, onApply }: IMergerModalTitle) => {
  return (
    <Group justify="space-between" sx={{ position: 'relative' }}>
      <Group gap={7}>
        <Text fw={500} size="xl">
          Merge Changes
        </Text>
      </Group>
      <Group gap={20}>
        <Group>
          <Button
            size="xs"
            color="red"
            variant="filled"
            leftSection={<IconRecycle size={14} />}
            disabled={state.resolvedDifferences.size === 0}
            onClick={() => state.undo()}
          >
            Undo
          </Button>
          <ApplyButton state={state} onApply={onApply} />
        </Group>
      </Group>
    </Group>
  );
});
