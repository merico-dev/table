import { Group, Menu, Text, UnstyledButton } from '@mantine/core';
import { useBoolean } from 'ahooks';
import { forwardRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AddressBook, ChevronRight, Logout, ShieldLock } from 'tabler-icons-react';
import { useAccountContext } from '../../frames/require-auth/account-context';
import { ChangePassword } from './change-password';
import { UpdateProfileModal } from './update-profile';

interface UserButtonProps extends React.ComponentPropsWithoutRef<'button'> {
  username: string;
  email: string;
}

const UserButton = forwardRef<HTMLButtonElement, UserButtonProps>(
  ({ username, email, ...rest }: UserButtonProps, ref) => (
    <UnstyledButton
      ref={ref}
      px="md"
      py={0}
      sx={(theme) => ({
        display: 'block',
        width: '100%',
        height: '60px',
        color: theme.black,

        '&:hover': {
          backgroundColor: theme.colors.gray[0],
        },
      })}
      {...rest}
    >
      <Group>
        <div style={{ flex: 1 }}>
          <Text size="sm" weight={500}>
            {username}
          </Text>

          <Text color="dimmed" size="xs">
            {email}
          </Text>
        </div>

        <ChevronRight size={16} />
      </Group>
    </UnstyledButton>
  ),
);

export function AccountDropdown() {
  const { account } = useAccountContext();
  const navigate = useNavigate();
  const logout = () => {
    window.localStorage.removeItem('token');
    window.localStorage.removeItem('redirect_to');
    window.localStorage.removeItem('last_visited_dashboard_id');
    navigate('/login');
  };
  const [profileOpened, { setTrue: openProfile, setFalse: closeProfile }] = useBoolean();
  const [passwordOpened, { setTrue: openPassword, setFalse: closePassword }] = useBoolean();
  return (
    <Group position="center">
      <Menu withinPortal>
        <Menu.Target>
          <UserButton username={account.name} email={account.email} />
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Label>Account Settings</Menu.Label>

          <Menu.Item icon={<AddressBook size={14} />} onClick={openProfile}>
            Profile
          </Menu.Item>

          <Menu.Item icon={<ShieldLock size={14} />} onClick={openPassword}>
            Password
          </Menu.Item>

          <Menu.Divider />

          <Menu.Item color="red" icon={<Logout size={14} />} onClick={logout}>
            Logout
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
      <UpdateProfileModal account={account} opened={profileOpened} onClose={closeProfile} />
      <ChangePassword account={account} opened={passwordOpened} onClose={closePassword} />
    </Group>
  );
}
