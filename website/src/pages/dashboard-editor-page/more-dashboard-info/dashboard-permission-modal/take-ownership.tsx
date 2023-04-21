import { Button } from '@mantine/core';
import { IconShieldLock } from '@tabler/icons';
import { observer } from 'mobx-react-lite';
import { useAccountContext } from '../../../../frames/require-auth/account-context';

interface ITakeOwnership {
  id: string;
}

export const TakeOwnership = observer(({ id }: ITakeOwnership) => {
  const { isAdmin } = useAccountContext();
  return (
    <Button size="xs" variant="light" color="red" leftIcon={<IconShieldLock size={14} />} disabled={!isAdmin}>
      Take ownership
    </Button>
  );
});
