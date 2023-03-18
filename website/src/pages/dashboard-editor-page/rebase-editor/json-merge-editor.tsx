/* eslint-disable @typescript-eslint/no-non-null-assertion,@typescript-eslint/no-explicit-any */
import { Button, Card, Group, Stack, Text } from '@mantine/core';
import { toJS } from 'mobx';
import { observer } from 'mobx-react-lite';
import { IResolveResult, MergeJsonDocsState, NodeDiffContext } from './merge-json-docs-state';

export interface IJsonMergeEditorProps {
  state: MergeJsonDocsState;
  onApply?: (resolveList: IResolveResult[]) => void;
}

export const JsonMergeEditor = observer(({ state, onApply }: IJsonMergeEditorProps) => {
  const handleApply = () => {
    onApply?.(Array.from(state.resolvedDifferences.values()).map((it) => toJS(it)));
  };

  return (
    <Stack>
      <Card style={{ position: 'sticky', top: 0, zIndex: 2 }} withBorder shadow="sm">
        <Group position="apart">
          <Group>
            <Text>Total conflicts: {state.conflicts.length}</Text>
            <Text>Pending changes: {state.resolvedDifferences.size}</Text>
          </Group>
          <Group>
            <Button disabled={state.resolvedDifferences.size === 0} variant="outline" onClick={() => state.undo()}>
              Undo
            </Button>
            <Button variant="outline">Cancel</Button>
            <Button disabled={!state.canApply} onClick={handleApply}>
              Apply
            </Button>
          </Group>
        </Group>
      </Card>
      {state.conflicts.map((diff) => (
        <Card key={diff.key} withBorder>
          <Group position="apart" aria-label={'changed: ' + diff.objectDescription}>
            <Stack spacing="xs">
              <Text>{diff.objectDescription}</Text>
              <LocalChangesText diff={diff} resolvedResult={state.resolvedDifferences.get(diff.key)} />
              <RemoteChangesText diff={diff} resolvedResult={state.resolvedDifferences.get(diff.key)} />
            </Stack>
            {state.isResolved(diff.key) ? null : (
              <Stack spacing="xs">
                {/*<Button size="xs" variant="outline">Merge Manually</Button>*/}
                <Button aria-label="accept local" size="xs" onClick={() => state.acceptLocalChanges(diff)}>
                  Accept Local
                </Button>
                <Button aria-label="accept remote" size="xs" onClick={() => state.acceptRemoteChange(diff)}>
                  Accept Remote
                </Button>
              </Stack>
            )}
          </Group>
        </Card>
      ))}
    </Stack>
  );
});

const LocalChangesText = observer(
  ({ diff, resolvedResult }: { diff: NodeDiffContext; resolvedResult?: IResolveResult }) => {
    const resolved = !!resolvedResult;
    return (
      <Text
        color={resolved && resolvedResult.from === 'local' ? 'green' : 'gray'}
        strikethrough={resolved && resolvedResult.from !== 'local'}
      >
        Local: {diff.localChanges}
      </Text>
    );
  },
);

const RemoteChangesText = observer(
  ({ diff, resolvedResult }: { diff: NodeDiffContext; resolvedResult?: IResolveResult }) => {
    const resolved = !!resolvedResult;
    return (
      <Text
        color={resolved && resolvedResult.from === 'remote' ? 'green' : 'gray'}
        strikethrough={resolved && resolvedResult.from !== 'remote'}
      >
        Remote: {diff.remoteChanges}
      </Text>
    );
  },
);

// todo:
// x list of diff nodes
// x accept local changes
// x accept remote changes
// - detail view of node (3 way merge view)
// x power accessor get accessor
