import { Button } from '@mantine/core';
import { IconShieldLock } from '@tabler/icons';
import { useBoolean } from 'ahooks';
import { observer } from 'mobx-react-lite';
import { DashboardPermissionAPI } from '../../../../api-caller/dashboard-permission';
import { useAccountContext } from '../../../../frames/require-auth/account-context';

interface ITakeOwnership {
  id: string;
  refresh: () => void;
}

export const TakeOwnership = observer(({ id, refresh }: ITakeOwnership) => {
  const { isAdmin, account } = useAccountContext();
  const [loading, { setTrue, setFalse }] = useBoolean(false);
  const take = async () => {
    setTrue();
    await DashboardPermissionAPI.updateOwner({ id, owner_id: account.id, owner_type: 'ACCOUNT' });
    setFalse();
    refresh();
  };
  return (
    <Button
      size="xs"
      variant="light"
      color="red"
      leftIcon={<IconShieldLock size={14} />}
      disabled={!isAdmin || loading}
      onClick={take}
    >
      Take ownership
    </Button>
  );
});
