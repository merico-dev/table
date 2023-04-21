import { ActionIcon, Tooltip } from '@mantine/core';
import { IconApi, IconUser } from '@tabler/icons';

export const AccountTypeIcon = ({ type }: { type: 'ACCOUNT' | 'APIKEY' | null }) => {
  if (!type) {
    return null;
  }
  return (
    <Tooltip label={type === 'APIKEY' ? 'API Key' : 'Account'}>
      <ActionIcon variant="subtle" sx={{ cursor: 'help', transform: 'none !important' }}>
        {type === 'APIKEY' ? <IconApi size={14} /> : <IconUser size={14} />}
      </ActionIcon>
    </Tooltip>
  );
};
