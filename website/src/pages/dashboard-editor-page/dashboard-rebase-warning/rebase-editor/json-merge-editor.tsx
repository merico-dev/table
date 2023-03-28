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
        <Card px={0} withBorder>
          <Card.Section withBorder inheritPadding py="xs">
            {!resolved && (
              <Group px="xs" position="apart">
                <Text size={14} fw={500}>
                  Local Changes
                </Text>
                <Tooltip
                  label={
                    <Group spacing={4}>
                      <Text>This will discard</Text>
                      <Text fw={700} sx={{ display: 'inline-block' }}>
                        remote
                      </Text>
                      <Text>changes</Text>
                    </Group>
                  }
                >
                  <Button
                    compact
                    px="sm"
                    size="xs"
                    color="green"
                    aria-label="use local"
                    leftIcon={<IconCheck size={14} />}
                    onClick={() => state.acceptLocalChanges(diff)}
                  >
                    Accept
                  </Button>
                </Tooltip>
              </Group>
            )}
          </Card.Section>
          <Card.Section inheritPadding pt="xs">
            <JsonChangesViewer base={diff.values.base} changed={localChanged} />
          </Card.Section>
        </Card>
        <Card px={0} withBorder>
          <Card.Section withBorder inheritPadding py="xs">
            {!resolved && (
              <Group px="xs" position="apart">
                <Text size={14} fw={500}>
                  Remote Changes
                </Text>
                <Tooltip
                  label={
                    <Group spacing={4}>
                      <Text>This will discard</Text>
                      <Text fw={700} sx={{ display: 'inline-block' }}>
                        local
                      </Text>
                      <Text>changes</Text>
                    </Group>
                  }
                >
                  <Button
                    compact
                    px="sm"
                    size="xs"
                    color="green"
                    aria-label="use local"
                    leftIcon={<IconCheck size={14} />}
                    onClick={() => state.acceptRemoteChange(diff)}
                  >
                    Accept
                  </Button>
                </Tooltip>
              </Group>
            )}
          </Card.Section>

          <Card.Section inheritPadding pt="xs">
            <JsonChangesViewer base={diff.values.base} changed={remoteChanged} />
          </Card.Section>
        </Card>
      </Group>

      {/* <Group position="apart">
        <ChangesText changeSource="local" diff={diff} resolvedResult={state.resolvedDifferences.get(diff.key)} />
        <ChangesText changeSource="remote" diff={diff} resolvedResult={state.resolvedDifferences.get(diff.key)} />
      </Group> */}
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
