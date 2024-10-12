import { Group, Highlight, rem, Text, UnstyledButton } from '@mantine/core';
import { createStyles } from '@mantine/emotion';
import { SpotlightActionProps } from '@mantine/spotlight';
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
        <Text c="dimmed" opacity={0} size="xs" className="spotlight-action-viz-group">
          {t(action.viz.displayGroup)}
        </Text>
      </Group>
    );
  }
  return null;
};

const useStyles = createStyles((theme, params: null) => ({
  action: {
    position: 'relative',
    display: 'block',
    width: '100%',
    padding: `${rem(10)} ${rem(12)}`,
    borderRadius: theme.radius.sm,
    '&:hover': {
      backgroundColor: theme.colors.gray[1],
      '.spotlight-action-viz-group': {
        opacity: 1,
      },
    },

    '&[data-hovered]': {
      backgroundColor: theme.colors.gray[1],
      '.spotlight-action-viz-group': {
        opacity: 1,
      },
    },
  },
}));

type Props = SpotlightActionProps & {
  action: CustomSpotlightActionData;
  hovered?: any;
  query?: any;
};
export const SpotlightActionComponent = observer(
  ({ action, hovered, onClick, highlightQuery, query, ...others }: Props) => {
    const { t } = useTranslation();
    const { classes } = useStyles(null);

    return (
      <UnstyledButton
        className={classes.action}
        data-hovered={hovered || undefined}
        tabIndex={-1}
        onMouseDown={(event) => event.preventDefault()}
        onClick={onClick}
        // {...others}
      >
        <Group wrap="nowrap">
          <ActionIcon iconKey={action.iconKey} size={14} />

          <div style={{ flex: 1 }}>
            <Highlight highlight={query} size="sm">
              {action.title ? t(action.title) : ''}
            </Highlight>

            <Description action={action} />
          </div>
        </Group>
      </UnstyledButton>
    );
  },
);
