import { ActionIcon, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconHistory } from '@tabler/icons';
import { observer } from 'mobx-react-lite';
import { DashboardHistory } from './dashboard-history';

export const DashboardHistoryModal = observer(() => {
  const [opened, { open, close }] = useDisclosure(false);
  return (
    <>
      <Modal opened={opened} onClose={close} zIndex={320} title="History" fullScreen>
        <DashboardHistory />
      </Modal>
      <ActionIcon onClick={open} color="blue" variant="light">
        <IconHistory size={16} />
      </ActionIcon>
    </>
  );
});
