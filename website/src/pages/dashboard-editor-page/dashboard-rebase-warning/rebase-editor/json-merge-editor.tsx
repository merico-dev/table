/* eslint-disable @typescript-eslint/no-non-null-assertion,@typescript-eslint/no-explicit-any */
import { Button, Card, Group, Modal, Stack, Text, Tooltip } from '@mantine/core';
import { IconArrowLeft, IconArrowRight, IconCheck } from '@tabler/icons';
import { useBoolean } from 'ahooks';
import { capitalCase } from 'change-case';
import _, { get } from 'lodash';
import { toJS } from 'mobx';
import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { JsonChangesViewer } from './json-changes-viewer';
import { JSONMergeChooser } from './json-merge-chooser';
import { IResolveResult, MergeJsonDocsState, NodeDiffContext } from './merge-json-docs-state';

export interface IJsonMergeEditorProps {
  state: MergeJsonDocsState;
}

export const JsonMergeEditor = observer(({ state }: IJsonMergeEditorProps) => {
  const lastIndex = state.differences.length - 1;
  const [current, setCurrent] = useState(0);
  const next = () => setCurrent((current) => _.clamp(current + 1, 0, lastIndex));
  const prev = () => setCurrent((current) => _.clamp(current - 1, 0, lastIndex));
  const diff = state.differences[current];
  const localChanged = toJS(get(diff.values, 'local'));
  const remoteChanged = toJS(get(diff.values, 'remote'));

  const resolved = state.isResolved(diff.key);
  return (
    <Stack spacing={10}>
      <Group>
        <Text>Total changes: {state.differences.length}</Text>
        <Text>Pending changes: {state.resolvedDifferences.size}</Text>
      </Group>
      {lastIndex > 0 ? (
        <Group position="apart">
          <Button size="xs" variant="light" leftIcon={<IconArrowLeft size={14} />} onClick={prev}>
            Previous
          </Button>
          <Text>{diff.objectDescription}</Text>
          <Button size="xs" variant="light" leftIcon={<IconArrowRight size={14} />} onClick={next}>
            Next
          </Button>
        </Group>
      ) : (
        <Text ta="center">{diff.objectDescription}</Text>
      )}
      <Group grow position="apart" spacing="xs">
        <JSONMergeChooser
          diff={diff}
          opposite="remote"
          resolved={resolved}
          label="Local Changes"
          changed={localChanged}
          onClick={() => state.acceptLocalChanges(diff)}
        />
        <JSONMergeChooser
          diff={diff}
          opposite="local"
          resolved={resolved}
          label="Remote Changes"
          changed={remoteChanged}
          onClick={() => state.acceptRemoteChange(diff)}
        />
      </Group>

      {/* <Group position="apart">
        <ChangesText changeSource="local" diff={diff} resolvedResult={state.resolvedDifferences.get(diff.key)} />
        <ChangesText changeSource="remote" diff={diff} resolvedResult={state.resolvedDifferences.get(diff.key)} />
      </Group> */}
    </Stack>
  );
});

// todo:
// x list of diff nodes
// x accept local changes
// x accept remote changes
// - detail view of node (3 way merge view)
// x power accessor get accessor
