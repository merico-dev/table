import { ActionIcon, Box, Button, Divider, Group, Text, Tooltip, UnstyledButton } from '@mantine/core';
import { IconAdjustments, IconPlus } from '@tabler/icons';
import { useBoolean } from 'ahooks';
import { observer } from 'mobx-react-lite';
import { useCallback } from 'react';
import { useModelContext } from '~/contexts';
import { EditViewModal } from './edit-view-modal';

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
  const getClickHandler = useCallback((id: string) => () => model.views.setIDOfVIE(id), [model]);
  const [settingsVisible, { setTrue, setFalse }] = useBoolean(false);
  return (
    <Box pt="sm" sx={{ position: 'relative' }}>
      {model.views.options.map((v) => (
        <ViewLink
          key={v.value}
          active={model.views.idOfVIE === v.value}
          name={v.label}
          onClick={getClickHandler(v.value)}
          openSettings={setTrue}
        />
      ))}
      <Divider variant="dashed" />
      <Button
        variant="subtle"
        rightIcon={<IconPlus size={14} />}
        size="sm"
        px="xs"
        color="blue"
        onClick={model.views.addARandomNewView}
        sx={{ width: '100%', borderRadius: 0 }}
        styles={{
          inner: {
            justifyContent: 'space-between',
          },
        }}
      >
        Add a View
      </Button>
      <EditViewModal opened={settingsVisible} close={setFalse} />
    </Box>
  );
});
