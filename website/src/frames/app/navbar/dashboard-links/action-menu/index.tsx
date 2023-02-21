import { ActionIcon, Menu } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { Edit, FileImport, Menu2, Paint } from 'tabler-icons-react';
import { useAccountContext } from '../../../../require-auth/account-context';
import { DeleteDashboard } from './delete-dashboard';

interface IActionMenu {
  id: string;
  preset: boolean;
  openOverwriteModal: (id: string) => void;
  openEditModal: (id: string) => void;
}
export const ActionMenu = ({ id, preset, openOverwriteModal, openEditModal }: IActionMenu) => {
  const navigate = useNavigate();
  const { canEdit } = useAccountContext();

  const visitDashboardDesign = () => {
    navigate(`/dashboard/${id}/edit`);
  };

  if (!canEdit || preset) {
    return null;
  }
  return (
    <Menu shadow="md" width={220} withinPortal trigger="hover">
      <Menu.Target>
        <ActionIcon
          variant="subtle"
          color="blue"
          sx={{
            width: '42px',
            height: '42px',
          }}
        >
          <Menu2 size={18} />
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
