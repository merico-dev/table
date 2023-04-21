import { Button } from '@mantine/core';
import { IconUserPlus } from '@tabler/icons';
import { observer } from 'mobx-react-lite';
import { useAccountContext } from '../../../../frames/require-auth/account-context';

interface IAddAPermissionRule {
  id: string;
}

export const AddAPermissionRule = observer(({ id }: IAddAPermissionRule) => {
  const { isAdmin } = useAccountContext();
  return (
    <Button size="xs" variant="light" leftIcon={<IconUserPlus size={14} />}>
      Add a permission rule
    </Button>
  );
});
