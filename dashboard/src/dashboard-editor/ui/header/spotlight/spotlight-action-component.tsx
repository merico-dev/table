import { Box, Group, Highlight, Text } from '@mantine/core';
import {
  IconAppWindow,
  IconBoxMultiple,
  IconCodeDots,
  IconCopy,
  IconDatabase,
  IconFilter,
  IconVariable,
  TablerIconsProps,
} from '@tabler/icons-react';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { CustomSpotlightActionData } from '~/dashboard-editor/model/editor';

const ActionIcon = ({ iconKey, ...props }: { iconKey?: string } & TablerIconsProps) => {
  switch (iconKey) {
    case 'query_variables':
      return <IconVariable {...props} />;
    case 'mock_context':
      return <IconCodeDots {...props} />;
    case 'filter':
      return <IconFilter {...props} />;
    case 'sql_snippet':
      return <IconCopy {...props} />;
    case 'query':
      return <IconDatabase {...props} />;
    case 'view':
      return <IconBoxMultiple {...props} />;
    case 'panel':
      return <IconAppWindow {...props} />;
    default:
      return null;
  }
};

const Description = ({ action }: { action: CustomSpotlightActionData }) => {
  const { t } = useTranslation();
  if (action.description) {
    return (
      <Text c="dimmed" size="xs">
        {t(action.description)}
      </Text>
    );
  }
  if (action.viz) {
    return (
      <Group justify="space-between">
        <Text c="dimmed" size="xs">
          {t(action.viz.displayName)}
        </Text>
        <Text c="dimmed" size="xs" className="spotlight-action-viz-group">
          {t(action.viz.displayGroup)}
        </Text>
      </Group>
    );
  }
  return null;
};

type Props = {
  action: CustomSpotlightActionData;
  query: string;
};
export const SpotlightActionComponent = observer(({ action, query }: Props) => {
  const { t } = useTranslation();

  return (
    <Box className="spotlight-custom-action-component">
      <Group wrap="nowrap">
        <ActionIcon iconKey={action.iconKey} size={14} />

        <div style={{ flex: 1 }}>
          <Highlight highlight={query} size="sm">
            {action.title ? t(action.title) : ''}
          </Highlight>

          <Description action={action} />
        </div>
      </Group>
    </Box>
  );
});
