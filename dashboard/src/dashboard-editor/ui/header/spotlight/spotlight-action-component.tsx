import { Badge, Center, Group, Highlight, rem, Text, UnstyledButton } from '@mantine/core';
import { SpotlightAction, SpotlightActionProps } from '@mantine/spotlight';
import { createStyles } from '@mantine/emotion';
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

const ActionIcon = ({ iconKey, ...props }: { iconKey: string } & TablerIconsProps) => {
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

const Description = ({ action }: { action: SpotlightAction }) => {
  const { t } = useTranslation();
  if (action.description) {
    return (
      <Text color="dimmed" size="xs">
        {t(action.description)}
      </Text>
    );
  }
  if (action.viz) {
    return (
      <Group justify="apart">
        <Text color="dimmed" size="xs">
          {t(action.viz.displayName)}
        </Text>
        <Text color="dimmed" opacity={0} size="xs" className="spotlight-action-viz-group">
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
    ...theme.fn.hover({
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[1],
      '.spotlight-action-viz-group': {
        opacity: 1,
      },
    }),

    '&[data-hovered]': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[1],
      '.spotlight-action-viz-group': {
        opacity: 1,
      },
    },
  },
}));

export const SpotlightActionComponent = observer(
  ({ action, styles, classNames, hovered, onTrigger, highlightQuery, query, ...others }: SpotlightActionProps) => {
    const { t } = useTranslation();
    const { classes } = useStyles(null, { styles, classNames, name: 'Spotlight' });

    return (
      <UnstyledButton
        className={classes.action}
        data-hovered={hovered || undefined}
        tabIndex={-1}
        onMouseDown={(event) => event.preventDefault()}
        onClick={onTrigger}
        {...others}
      >
        <Group wrap="nowrap">
          <ActionIcon iconKey={action.iconKey} size={14} />

          <div style={{ flex: 1 }}>
            <Highlight highlight={query} size="sm">
              {t(action.title)}
            </Highlight>

            <Description action={action} />
          </div>
        </Group>
      </UnstyledButton>
    );
  },
);
