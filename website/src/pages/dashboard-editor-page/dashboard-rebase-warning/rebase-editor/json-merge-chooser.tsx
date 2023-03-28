import { Button, Card, Group, Text, Tooltip } from '@mantine/core';
import { IconCheck } from '@tabler/icons';
import { observer } from 'mobx-react-lite';
import { IJsonChangesViewerProps, JsonChangesViewer } from './json-changes-viewer';
import { NodeDiffContext } from './merge-json-docs-state';

interface IJSONMergeChooser {
  label: string;
  opposite: string;
  resolved: boolean;
  onClick: () => void;
  diff: NodeDiffContext;
  changed: IJsonChangesViewerProps['changed'];
}

export const JSONMergeChooser = observer(({ resolved, diff, changed, label, opposite, onClick }: IJSONMergeChooser) => {
  return (
    <Card px={0} withBorder>
      <Card.Section withBorder inheritPadding py="xs">
        {!resolved && (
          <Group px="xs" position="apart">
            <Text size={14} fw={500}>
              {label}
            </Text>
            <Tooltip
              label={
                <Group spacing={4}>
                  <Text>This will discard</Text>
                  <Text fw={700} sx={{ display: 'inline-block' }}>
                    {opposite}
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
                onClick={onClick}
              >
                Accept
              </Button>
            </Tooltip>
          </Group>
        )}
      </Card.Section>
      <Card.Section inheritPadding pt="xs">
        <JsonChangesViewer base={diff.values.base} changed={changed} />
      </Card.Section>
    </Card>
  );
});
