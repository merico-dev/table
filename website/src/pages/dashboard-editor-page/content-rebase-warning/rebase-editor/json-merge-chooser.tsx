import { Badge, Button, Card, Group, Overlay, Text, Tooltip } from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';
import { observer } from 'mobx-react-lite';
import { ErrorBoundary } from '../../../../utils/error-boundary';
import { IJsonChangesViewerProps, JsonChangesViewer } from './json-changes-viewer';
import { NodeDiffContext } from './merge-json-docs-state';

interface IResolveAction {
  opposite: string;
  resolved: boolean;
  chosen: boolean;
  onClick: () => void;
}

const ResolveAction = observer(({ opposite, onClick, resolved, chosen }: IResolveAction) => {
  if (chosen) {
    return (
      <Badge color="green" sx={{ textTransform: 'none', cursor: 'default', userSelect: 'none', height: '26px' }}>
        <Group>
          <IconCheck size={14} />
          Chosen
        </Group>
      </Badge>
    );
  }
  if (resolved) {
    return null;
  }
  return (
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
        px="sm"
        size="xs"
        color="green"
        aria-label="use local"
        leftIcon={<IconCheck size={14} />}
        onClick={onClick}
        sx={{ height: 26 }}
      >
        Accept
      </Button>
    </Tooltip>
  );
});

interface IJSONMergeChooser {
  label: string;
  opposite: string;
  resolved: boolean;
  chosen: boolean;
  onClick: () => void;
  diff: NodeDiffContext;
  changed: IJsonChangesViewerProps['changed'];
}

export const JSONMergeChooser = observer(
  ({ resolved, diff, changed, label, opposite, onClick, chosen }: IJSONMergeChooser) => {
    return (
      <Card px={0} withBorder>
        <Card.Section withBorder inheritPadding py="xs">
          <Group px="xs" position="apart">
            <Text size={14} fw={500}>
              {label}
            </Text>
            <ResolveAction resolved={resolved} opposite={opposite} onClick={onClick} chosen={chosen} />
          </Group>
        </Card.Section>
        <Card.Section inheritPadding pt="xs" sx={{ position: 'relative' }}>
          {resolved && !chosen && <Overlay color="white" opacity={0.6} />}
          <ErrorBoundary>
            <JsonChangesViewer base={diff.values.base} changed={changed} />
          </ErrorBoundary>
        </Card.Section>
      </Card>
    );
  },
);
