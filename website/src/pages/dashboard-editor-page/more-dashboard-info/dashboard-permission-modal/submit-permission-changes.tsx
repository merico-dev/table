import { Button } from '@mantine/core';
import { IconCheck, IconUserPlus } from '@tabler/icons';
import { observer } from 'mobx-react-lite';
import { useAccountContext } from '../../../../frames/require-auth/account-context';
import { DashboardPermissionAPI } from '../../../../api-caller/dashboard-permission';
import { useBoolean } from 'ahooks';
import { showNotification, updateNotification } from '@mantine/notifications';

interface ISubmitPermissionChanges {
  id: string;
  postSubmit: () => void;
}

export const SubmitPermissionChanges = observer(({ id, postSubmit }: ISubmitPermissionChanges) => {
  const [loading, { setTrue, setFalse }] = useBoolean(false);
  const submit = async () => {
    setTrue();
    showNotification({
      id: 'submit',
      title: 'Pending',
      message: 'Submitting permission changes...',
      loading: true,
    });
    await DashboardPermissionAPI.update({ id, access: [] });
    setFalse();
    updateNotification({
      id: 'submit',
      title: 'Successful',
      message: 'Permission has changed',
      color: 'green',
    });
    postSubmit();
  };
  return (
    <Button
      size="xs"
      variant="filled"
      color="green"
      leftIcon={<IconCheck size={14} />}
      onClick={submit}
      disabled={loading}
    >
      Confirm
    </Button>
  );
});
