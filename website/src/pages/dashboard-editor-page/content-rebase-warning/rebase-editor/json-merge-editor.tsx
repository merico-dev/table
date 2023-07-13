import { Button, Group, Stack, Text } from '@mantine/core';
import { IconArrowLeft, IconArrowRight } from '@tabler/icons-react';
import _, { get } from 'lodash';
import { toJS } from 'mobx';
import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { JSONMergeChooser } from './json-merge-chooser';
import { MergeJsonDocsState } from './merge-json-docs-state';

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
      {lastIndex > 0 ? (
        <Group position="apart">
          <Button
            size="xs"
            variant="light"
            leftIcon={<IconArrowLeft size={14} />}
            onClick={prev}
            disabled={current === 0}
          >
            Previous
          </Button>
          <Text>{diff.objectDescription}</Text>
          <Button
            size="xs"
            variant={resolved ? 'filled' : 'light'}
            leftIcon={<IconArrowRight size={14} />}
            onClick={next}
            disabled={current === lastIndex}
          >
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
          chosen={resolved && state.resolvedDifferences.get(diff.key)?.from === 'local'}
          resolved={resolved}
          label="Local Changes"
          changed={localChanged}
          onClick={() => state.acceptLocalChanges(diff)}
        />
        <JSONMergeChooser
          diff={diff}
          opposite="local"
          resolved={resolved}
          chosen={resolved && state.resolvedDifferences.get(diff.key)?.from === 'remote'}
          label="Remote Changes"
          changed={remoteChanged}
          onClick={() => state.acceptRemoteChange(diff)}
        />
      </Group>
    </Stack>
  );
});

// todo:
// x list of diff nodes
// x accept local changes
// x accept remote changes
// - detail view of node (3 way merge view)
// x power accessor get accessor
