import { ActionIcon, Menu, Tooltip, useMantineTheme } from '@mantine/core';
import { IconLock, IconSettings } from '@tabler/icons';
import { useNavigate } from 'react-router-dom';
import { Edit, FileImport, Paint } from 'tabler-icons-react';
import { useAccountContext } from '../../../../require-auth/account-context';
import { DeleteDashboard } from './delete-dashboard';

interface IActionMenu {
  id: string;
  preset?: boolean;
  openOverwriteModal: (id: string) => void;
  openEditModal: (id: string) => void;
}
export const ActionMenu = ({ id, preset, openOverwriteModal, openEditModal }: IActionMenu) => {
  const theme = useMantineTheme();
  const navigate = useNavigate();
  const { canEdit } = useAccountContext();

  const visitDashboardDesign = () => {
    navigate(`/dashboard/${id}/edit`);
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
        <span>
          <IconLock size="16px" color={theme.colors.gray[7]} />
        </span>
      </Tooltip>
    );
  }
  if (!canEdit || preset) {
    return null;
  }
  return (
    <Menu shadow="md" width={220} withinPortal withArrow position="right" trigger="hover">
      <Menu.Target>
        <ActionIcon
          variant="subtle"
          color="blue"
          sx={{
            width: '42px',
            height: '42px',
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
          }}
        >
          <IconSettings size={18} />
        </ActionIcon>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item icon={<Paint size={16} />} onClick={visitDashboardDesign}>
          Design
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item onClick={() => openEditModal(id)} icon={<Edit size={16} />}>
          Rename
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item onClick={() => openOverwriteModal(id)} icon={<FileImport size={16} />}>
          Overwrite with JSON file
        </Menu.Item>
        <Menu.Divider />
        <DeleteDashboard id={id} />
      </Menu.Dropdown>
    </Menu>
  );
};
