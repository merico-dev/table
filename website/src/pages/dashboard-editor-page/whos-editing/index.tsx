import { Badge, Group, HoverCard } from '@mantine/core';
import { IconPaint } from '@tabler/icons';
import { observer } from 'mobx-react-lite';
import { useEffect, useMemo, useState } from 'react';
import { useDashboardStore } from '../../../frames/app/models/dashboard-store-context';
import { useSocketContext } from '../../../frames/socket-client-frame/socket-context';
import { CLIENT_CHANNELS, SERVER_CHANNELS } from '../../../frames/socket-client-frame/types';
import { HoverContent } from './hover-content';
import { PresenceType } from './types';

export const WhosEditing = observer(() => {
  const { store } = useDashboardStore();
  const { socket } = useSocketContext();

  const id = store.currentID;
  const [presence, setPresence] = useState<PresenceType>({});

  useEffect(() => {
    socket.emit(CLIENT_CHANNELS.DASHBOARD_START_EDIT, { id });
    socket.on(`${SERVER_CHANNELS.DASHBOARD_EDIT_PRESENCE}:${id}`, setPresence);
    return () => {
      socket.emit(CLIENT_CHANNELS.DASHBOARD_END_EDIT, { id });
    };
  }, [socket, id]);

  const { accounts, clients } = useMemo(() => {
    const accounts = Object.keys(presence);
    const clients = Object.values(presence).reduce((acc, cur) => acc + cur, 0);
    return { accounts, clients };
  }, [presence]);

  // only you're editing
  if (clients === 1) {
    return null;
  }
  return (
    <Group sx={{ flexGrow: 1 }} position="right">
      <HoverCard width={280} shadow="md">
        <HoverCard.Target>
          <Badge
            size="lg"
            color="orange"
            leftSection={<IconPaint size={14} />}
            styles={{ root: { cursor: 'default' }, leftSection: { svg: { verticalAlign: 'text-top' } } }}
          >
            {clients}
          </Badge>
        </HoverCard.Target>
        <HoverCard.Dropdown>
          <HoverContent clients={clients} accounts={accounts} presence={presence} />
        </HoverCard.Dropdown>
      </HoverCard>
    </Group>
  );
});
