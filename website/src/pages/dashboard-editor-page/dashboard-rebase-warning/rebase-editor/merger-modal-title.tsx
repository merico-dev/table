import { ActionIcon, Button, Group, Text, Tooltip } from '@mantine/core';
import { IconDeviceFloppy, IconRecycle, IconX } from '@tabler/icons';
import { toJS } from 'mobx';
import { observer } from 'mobx-react-lite';
import { IResolveResult, MergeJsonDocsState } from './merge-json-docs-state';

export interface IMergerModalTitle {
  state: MergeJsonDocsState;
  onApply?: (resolveList: IResolveResult[]) => void;
  onCancel?: () => void;
}

export const MergerModalTitle = observer(({ state, onApply, onCancel }: IMergerModalTitle) => {
  const handleApply = () => {
    onApply?.(Array.from(state.resolvedDifferences.values()).map((it) => toJS(it)));
  };
  return (
    <Group position="apart">
      <Text fw={500} size="xl">
        Merge Changes
      </Text>
      <Group spacing={20}>
        <Group>
          <Button
            size="xs"
            color="red"
            variant="filled"
            leftIcon={<IconRecycle size={14} />}
            disabled={state.resolvedDifferences.size === 0}
            onClick={state.undo}
          >
            Undo
          </Button>
          <Button
            size="xs"
            color="green"
            variant="filled"
            leftIcon={<IconDeviceFloppy size={14} />}
            disabled={!state.canApply}
            onClick={handleApply}
          >
            Apply
          </Button>
        </Group>
        <Tooltip label="Cancel">
          <ActionIcon size="xs" color="red" variant="subtle" onClick={onCancel}>
            <IconX size={14} />
          </ActionIcon>
        </Tooltip>
      </Group>
    </Group>
  );
});
