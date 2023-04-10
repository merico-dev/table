import { Badge, Group, Tooltip } from '@mantine/core';
import { IconPaint } from '@tabler/icons';
import { observer } from 'mobx-react-lite';
import { useEffect, useMemo, useState } from 'react';
import { useDashboardStore } from '../../../frames/app/models/dashboard-store-context';
import { useSocketContext } from '../../../frames/socket-client-frame/socket-context';
import { CLIENT_CHANNELS, SERVER_CHANNELS } from '../../../frames/socket-client-frame/types';

function getLabel({ clients, accounts }: { clients: number; accounts: string[] }) {
  if (clients === 0) {
    return 'Something went wrong';
  }
  if (clients === 1) {
    return 'Only you are editing';
  }
  if (accounts.length === 1) {
    return `You're editing this dashboard with ${clients} browser tabs`;
  }
  return `${accounts.length} accounts are editing`;
}

type PresenceType = {
  [key: string]: number; // [id:type]: client count
};

export const WhosEditing = observer(() => {
  const { store } = useDashboardStore();
  const { socket } = useSocketContext();
  const [presence, setPresence] = useState<PresenceType>({});
  const id = store.currentID;
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
      <Tooltip label={getLabel({ clients, accounts })}>
        <Badge
          size="lg"
          color="indigo"
          leftSection={<IconPaint size={14} />}
          styles={{ root: { cursor: 'default' }, leftSection: { svg: { verticalAlign: 'text-top' } } }}
        >
          {clients}
        </Badge>
      </Tooltip>
    </Group>
  );
});
