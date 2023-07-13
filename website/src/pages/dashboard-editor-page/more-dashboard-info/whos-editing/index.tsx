import { Badge, HoverCard } from '@mantine/core';
import { IconArrowsShuffle } from '@tabler/icons-react';
import { observer } from 'mobx-react-lite';
import { useEffect, useMemo, useState } from 'react';
import { useDashboardStore } from '../../../../frames/app/models/dashboard-store-context';
import { useSocketContext } from '../../../../frames/socket-client-frame/socket-context';
import { CLIENT_CHANNELS, SERVER_CHANNELS } from '../../../../frames/socket-client-frame/types';
import { HoverContent } from './hover-content';
import { PresenceDataItem, PresenceDataItemType, PresenceType } from './types';

export const WhosEditing = observer(() => {
  const { store } = useDashboardStore();
  const { socket } = useSocketContext();

  const id = store.currentID;
  const [presence, setPresence] = useState<PresenceDataItem[]>([]);

  useEffect(() => {
    socket.emit(CLIENT_CHANNELS.DASHBOARD_START_EDIT, { id });
    socket.on(`${SERVER_CHANNELS.DASHBOARD_EDIT_PRESENCE}:${id}`, (data: PresenceType) => {
      const p = Object.entries(data).map(([pid, { name, count }]) => {
        const [id, type] = pid.split(':') as [string, PresenceDataItemType];
        return {
          id,
          type,
          name,
          count,
        };
      });
      setPresence(p);
    });
    return () => {
      socket.emit(CLIENT_CHANNELS.DASHBOARD_END_EDIT, { id });
    };
  }, [socket, id]);

  const total = useMemo(() => {
    return presence.reduce((acc, { count }) => acc + count, 0);
  }, [presence]);

  // websocket is not ready, or connection error occurs
  if (total === 0) {
    return null;
  }
  // only you're editing
  if (total === 1) {
    return null;
  }
  return (
    <HoverCard shadow="md" withinPortal zIndex={310}>
      <HoverCard.Target>
        <Badge
          size="lg"
          color="orange"
          leftSection={<IconArrowsShuffle size={14} />}
          styles={{ root: { cursor: 'default' }, leftSection: { svg: { verticalAlign: 'text-bottom' } } }}
        >
          {total}
        </Badge>
      </HoverCard.Target>
      <HoverCard.Dropdown px={10} py={7}>
        <HoverContent presence={presence} total={total} />
      </HoverCard.Dropdown>
    </HoverCard>
  );
});
