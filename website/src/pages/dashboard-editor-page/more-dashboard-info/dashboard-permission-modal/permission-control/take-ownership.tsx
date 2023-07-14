import { Button } from '@mantine/core';
import { IconShieldLock } from '@tabler/icons-react';
import { useBoolean } from 'ahooks';
import { observer } from 'mobx-react-lite';
import { APICaller } from '../../../../../api-caller';
import { useAccountContext } from '../../../../../frames/require-auth/account-context';
import { PermissionModelInstance } from '../model';

interface ITakeOwnership {
  model: PermissionModelInstance;
}

export const TakeOwnership = observer(({ model }: ITakeOwnership) => {
  const { isAdmin, account } = useAccountContext();
  const [loading, { setTrue, setFalse }] = useBoolean(false);
  const take = async () => {
    setTrue();
    await APICaller.dashboard_permission.updateOwner({ id: model.id, owner_id: account.id, owner_type: 'ACCOUNT' });
    setFalse();
    model.load();
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
