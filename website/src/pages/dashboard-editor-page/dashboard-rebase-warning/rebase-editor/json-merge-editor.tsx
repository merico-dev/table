/* eslint-disable @typescript-eslint/no-non-null-assertion,@typescript-eslint/no-explicit-any */
import { Button, Card, Group, Modal, Stack, Stepper, Text } from '@mantine/core';
import { toJS } from 'mobx';
import { observer } from 'mobx-react-lite';
import { IResolveResult, MergeJsonDocsState, NodeDiffContext } from './merge-json-docs-state';
import { useBoolean } from 'ahooks';
import { JsonChangesViewer } from './json-changes-viewer';
import { capitalCase } from 'change-case';
import { get } from 'lodash';
import { useState } from 'react';
import _ from 'lodash';
import { IconArrowLeft, IconArrowRight } from '@tabler/icons';

export interface IJsonMergeEditorProps {
  state: MergeJsonDocsState;
}

export const JsonMergeEditor = observer(({ state }: IJsonMergeEditorProps) => {
  const lastIndex = state.differences.length - 1;
  const [current, setCurrent] = useState(0);
  const next = () => setCurrent((current) => _.clamp(current + 1, 0, lastIndex));
  const prev = () => setCurrent((current) => _.clamp(current - 1, 0, lastIndex));
  const diff = state.differences[current];
  return (
    <Stack>
      <Group>
        <Text>Total changes: {state.differences.length}</Text>
        <Text>Pending changes: {state.resolvedDifferences.size}</Text>
      </Group>
      {lastIndex > 0 && (
        <Group position="apart">
          <Button size="xs" variant="light" leftIcon={<IconArrowLeft size={14} />} onClick={prev}>
            Previous
          </Button>
          <Button size="xs" variant="light" leftIcon={<IconArrowRight size={14} />} onClick={next}>
            Next
          </Button>
        </Group>
      )}

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
        <Modal size="xl" style={{ zIndex: 1010 }} opened={isOpen} onClose={open.setFalse} title={changesDesc}>
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
