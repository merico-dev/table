/* eslint-disable @typescript-eslint/no-non-null-assertion,@typescript-eslint/no-explicit-any */
import { Button, Card, Group, Modal, Stack, Text } from '@mantine/core';
import { toJS } from 'mobx';
import { observer } from 'mobx-react-lite';
import { IResolveResult, MergeJsonDocsState, NodeDiffContext } from './merge-json-docs-state';
import { useBoolean } from 'ahooks';
import { JsonChangesViewer } from './json-changes-viewer';
import { capitalCase } from 'change-case';
import { get } from 'lodash';

export interface IJsonMergeEditorProps {
  state: MergeJsonDocsState;
  onApply?: (resolveList: IResolveResult[]) => void;
  onCancel?: () => void;
}

export const JsonMergeEditor = observer(({ state, onCancel, onApply }: IJsonMergeEditorProps) => {
  const handleApply = () => {
    onApply?.(Array.from(state.resolvedDifferences.values()).map((it) => toJS(it)));
  };

  return (
    <Stack>
      <Card style={{ position: 'sticky', top: 0, zIndex: 2 }} withBorder shadow="sm">
        <Group position="apart">
          <Group>
            <Text>Total changes: {state.differences.length}</Text>
            <Text>Pending changes: {state.resolvedDifferences.size}</Text>
          </Group>
          <Group>
            <Button disabled={state.resolvedDifferences.size === 0} variant="outline" onClick={() => state.undo()}>
              Undo
            </Button>
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button disabled={!state.canApply} onClick={handleApply}>
              Apply
            </Button>
          </Group>
        </Group>
      </Card>
      {state.differences.map((diff) => (
        <Card key={diff.key} withBorder>
          <Group position="apart" aria-label={'changed: ' + diff.objectDescription}>
            <Stack spacing="xs">
              <Text>{diff.objectDescription}</Text>
              <ChangesText changeSource="local" diff={diff} resolvedResult={state.resolvedDifferences.get(diff.key)} />
              <ChangesText changeSource="remote" diff={diff} resolvedResult={state.resolvedDifferences.get(diff.key)} />
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

const ChangesText = observer(
  ({
    diff,
    resolvedResult,
    changeSource,
  }: {
    diff: NodeDiffContext;
    resolvedResult?: IResolveResult;
    changeSource: string;
  }) => {
    const resolved = !!resolvedResult;
    const [isOpen, open] = useBoolean(false);

    const changed = toJS(get(diff.values, changeSource));
    const changesDesc = `${capitalCase(changeSource)}: ${get(diff, `${changeSource}Changes`)}`;
    return (
      <>
        <Modal size="xl" style={{ zIndex: 490 }} opened={isOpen} onClose={open.setFalse} title={changesDesc}>
          {isOpen && <JsonChangesViewer base={diff.values.base} changed={changed} />}
        </Modal>
        <Text
          style={{ cursor: 'pointer' }}
          onClick={open.setTrue}
          color={resolved && resolvedResult.from === changeSource ? 'green' : 'gray'}
          strikethrough={resolved && resolvedResult.from !== changeSource}
        >
          {changesDesc}
        </Text>
      </>
    );
  },
);

// todo:
// x list of diff nodes
// x accept local changes
// x accept remote changes
// - detail view of node (3 way merge view)
// x power accessor get accessor
