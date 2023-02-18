import { ActionIcon, Box, Button, Divider, Group, Stack, Text, Tooltip, UnstyledButton } from '@mantine/core';
import { IconPlus } from '@tabler/icons';
import { useBoolean } from 'ahooks';
import { observer } from 'mobx-react-lite';
import { useCallback } from 'react';
import { useModelContext } from '~/contexts';
import { EViewComponentType, ViewComponentTypeColor, ViewComponentTypeName } from '~/types';

const ViewComponentTypeIndicator = ({ type, active }: { type: EViewComponentType; active: boolean }) => {
  return (
    <Tooltip
      position="right"
      label={ViewComponentTypeName[type]}
      withinPortal
      opened={active}
      color={ViewComponentTypeColor[type]}
      withArrow
    >
      <Box
        className="view-type-indicator"
        sx={{
          background: ViewComponentTypeColor[type],
          width: '2px',
          transition: 'width 200ms ease',
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          zIndex: 3,
        }}
      />
    </Tooltip>
  );
};

interface IViewLink {
  onClick: () => void;
  name: string;
  active: boolean;
  type: EViewComponentType;
}

function ViewLink({ onClick, name, active, type }: IViewLink) {
  const [tooltip, { setTrue, setFalse }] = useBoolean(false);
  return (
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
      onMouseEnter={setTrue}
      onMouseLeave={setFalse}
      onClick={onClick}
    >
      <ViewComponentTypeIndicator type={type} active={tooltip} />
      <Group>
        <Text size="sm">{name}</Text>
      </Group>
    </UnstyledButton>
  );
}

export const ViewLinks = observer(() => {
  const model = useModelContext();
  const getClickHandler = useCallback((id: string) => () => model.views.setIDOfVIE(id), [model]);

  return (
    <Box pt="sm" sx={{ position: 'relative' }}>
      {model.views.options.map((v) => (
        <ViewLink
          key={v.value}
          active={model.views.idOfVIE === v.value}
          name={v.label}
          onClick={getClickHandler(v.value)}
          type={v.type}
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
    </Box>
  );
});
