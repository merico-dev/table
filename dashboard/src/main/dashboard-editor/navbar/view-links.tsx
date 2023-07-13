import { ActionIcon, Box, Button, Divider, Group, Text, Tooltip, UnstyledButton } from '@mantine/core';
import { IconAdjustments, IconPlus } from '@tabler/icons-react';
import { observer } from 'mobx-react-lite';
import { useCallback } from 'react';
import { useContentModelContext, useModelContext } from '~/contexts';

interface IViewLink {
  onClick: () => void;
  name: string;
  active: boolean;
  openSettings: () => void;
}

function ViewLink({ onClick, name, active, openSettings }: IViewLink) {
  return (
    <Box sx={{ position: 'relative' }}>
      <UnstyledButton
        sx={(theme) => ({
          display: 'block',
          width: '100%',
          padding: theme.spacing.xs,
          borderRadius: 0,
          position: 'relative',
          color: theme.black,

          '&:hover': {
            backgroundColor: theme.colors.gray[0],
          },

          backgroundColor: active ? theme.colors.gray[2] : 'transparent',
        })}
      >
        <Group sx={{ width: 'calc(100% - 28px)' }} onClick={onClick}>
          <Text size="sm">{name}</Text>
        </Group>
      </UnstyledButton>
      {active && (
        <Tooltip label="Edit" position="right" withinPortal>
          <ActionIcon
            onClick={openSettings}
            variant="light"
            color="blue"
            sx={{ position: 'absolute', top: 0, bottom: 0, height: '100%', right: 0, zIndex: 0, borderRadius: 0 }}
          >
            <IconAdjustments size={16} />
          </ActionIcon>
        </Tooltip>
      )}
    </Box>
  );
}

export const ViewLinks = observer(() => {
  const model = useModelContext();
  const content = useContentModelContext();
  const getClickHandler = useCallback((id: string) => () => content.views.setIDOfVIE(id), [content]);
  const openSettings = (id: string) => {
    model.editor.open(['_VIEWS_', id]);
  };
  return (
    <Box sx={{ position: 'relative' }}>
      {content.views.options.map((v) => (
        <ViewLink
          key={v.value}
          active={content.views.idOfVIE === v.value}
          name={v.label}
          onClick={getClickHandler(v.value)}
          openSettings={() => openSettings(v.value)}
        />
      ))}
      <Divider variant="dashed" />
      <Button
        variant="subtle"
        rightIcon={<IconPlus size={14} />}
        size="sm"
        px="xs"
        color="blue"
        onClick={content.views.addARandomNewView}
        sx={{ width: '100%', borderRadius: 0 }}
        styles={{
          inner: {
            justifyContent: 'space-between',
          },
        }}
      >
        Add a View
      </Button>
    </Box>
  );
});
