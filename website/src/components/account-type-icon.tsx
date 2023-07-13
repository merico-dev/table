import { ActionIcon } from '@mantine/core';
import { IconApi, IconUser } from '@tabler/icons-react';

export const AccountTypeIcon = ({ type }: { type: 'ACCOUNT' | 'APIKEY' | null }) => {
  if (!type) {
    return null;
  }
  return (
    <ActionIcon variant="subtle" sx={{ transform: 'none !important' }}>
      {type === 'APIKEY' ? <IconApi size={18} /> : <IconUser size={14} />}
    </ActionIcon>
  );
};
