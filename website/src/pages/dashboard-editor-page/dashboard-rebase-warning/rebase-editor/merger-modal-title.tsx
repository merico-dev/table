import { ActionIcon, Button, Group, Table, Text, Tooltip } from '@mantine/core';
import { IconDeviceFloppy, IconRecycle, IconX } from '@tabler/icons';
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
          <tbody>
            <tr>
              <th>Pending changes</th>
              <td>{state.resolvedDifferences.size}</td>
            </tr>
            <tr>
              <th>Total changes</th>
              <td>{state.differences.length}</td>
            </tr>
          </tbody>
        </Table>
      }
    >
      {state.canApply ? (
        <Button
          size="xs"
          color="green"
          variant="filled"
          leftIcon={<IconDeviceFloppy size={14} />}
          onClick={handleApply}
        >
          Apply
        </Button>
      ) : (
        <Button
          size="xs"
          color="gray"
          variant="filled"
          leftIcon={<IconDeviceFloppy size={14} />}
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
    <Group position="apart" sx={{ position: 'relative' }}>
      <Group spacing={7}>
        <Text fw={500} size="xl">
          Merge Changes
        </Text>
      </Group>
      <Group spacing={20}>
        <Group>
          <Button
            size="xs"
            color="red"
            variant="filled"
            leftIcon={<IconRecycle size={14} />}
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
