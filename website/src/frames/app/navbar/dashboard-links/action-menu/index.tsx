import { ActionIcon, Menu, Sx, Tooltip } from '@mantine/core';
import { IconLock, IconSettings } from '@tabler/icons';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import { Edit, FileImport, Paint } from 'tabler-icons-react';
import { useAccountContext } from '../../../../require-auth/account-context';
import { DashboardBriefModelInstance } from '../../../models/dashboard-brief-model';
import { DeleteDashboard } from './delete-dashboard';

const ActionIconSx: Sx = {
  width: '42px',
  height: '42px',
  position: 'absolute',
  top: 0,
  right: 0,
  bottom: 0,
};

interface IActionMenu {
  model: DashboardBriefModelInstance;
  preset?: boolean;
  openOverwriteModal: (id: string) => void;
  openEditModal: (id: string) => void;
}
export const ActionMenu = observer(({ model, preset, openOverwriteModal, openEditModal }: IActionMenu) => {
  const navigate = useNavigate();
  const { account } = useAccountContext();

  const visitDashboardDesign = () => {
    navigate(`/dashboard/${model.id}/edit/${model.content_id}`);
  };
  if (preset) {
    return (
      <Tooltip
        position="right"
        withinPortal
        withArrow
        label="This is a preset dashboard. You can not edit it."
        events={{ hover: true, focus: false, touch: false }}
      >
        <ActionIcon color="gray" sx={{ transform: 'none !important', ...ActionIconSx }}>
          <IconLock size={16} />
        </ActionIcon>
      </Tooltip>
    );
  }

  if (!model.canEdit(account)) {
    return null;
  }

  return (
    <Menu shadow="md" width={220} withinPortal withArrow position="right" trigger="hover">
      <Menu.Target>
        <ActionIcon variant="subtle" color="blue" sx={ActionIconSx}>
          <IconSettings size={18} />
        </ActionIcon>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item icon={<Paint size={16} />} onClick={visitDashboardDesign}>
          Design
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item onClick={() => openEditModal(model.id)} icon={<Edit size={16} />}>
          Rename
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item onClick={() => openOverwriteModal(model.id)} icon={<FileImport size={16} />}>
          Overwrite with JSON file
        </Menu.Item>
        <Menu.Divider />
        <DeleteDashboard id={model.id} />
      </Menu.Dropdown>
    </Menu>
  );
});
