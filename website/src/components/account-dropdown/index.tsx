import { Group, Menu, Stack, Text, UnstyledButton } from '@mantine/core';
import { useBoolean } from 'ahooks';
import { forwardRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccountContext } from '../../frames/require-auth/account-context';
import { ChangePassword } from './change-password';
import { UpdateProfileModal } from './update-profile';
import { IconAddressBook, IconChevronRight, IconLogout, IconShieldLock } from '@tabler/icons-react';

interface UserButtonProps extends React.ComponentPropsWithoutRef<'button'> {
  username: string;
  email: string;
  height: number;
}

const UserButton = forwardRef<HTMLButtonElement, UserButtonProps>(
  ({ username, email, height, ...rest }: UserButtonProps, ref) => (
    <UnstyledButton
      ref={ref}
      px="md"
      py={0}
      sx={(theme) => ({
        display: 'block',
        width: '100%',
        height,
        color: theme.black,

        '&:hover': {
          backgroundColor: theme.colors.gray[0],
        },
      })}
      {...rest}
    >
      <Group>
        <Stack gap={0} style={{ flex: 1 }}>
          <Text size="sm" w={500}>
            {username}
          </Text>
          {email && (
            <Text mt={-4} color="dimmed" size={11}>
              {email}
            </Text>
          )}
        </Stack>

        <IconChevronRight size={16} />
      </Group>
    </UnstyledButton>
  ),
);

export function AccountDropdown({ height }: { height: number }) {
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
    <Group justify="center">
      <Menu withinPortal>
        <Menu.Target>
          <UserButton username={account.name} email={account.email} height={height} />
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Label>Account Settings</Menu.Label>

          <Menu.Item leftSection={<IconAddressBook size={14} />} onClick={openProfile}>
            Profile
          </Menu.Item>

          <Menu.Item leftSection={<IconShieldLock size={14} />} onClick={openPassword}>
            Password
          </Menu.Item>

          <Menu.Divider />

          <Menu.Item color="red" leftSection={<IconLogout size={14} />} onClick={logout}>
            Logout
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
      <UpdateProfileModal account={account} opened={profileOpened} onClose={closeProfile} />
      <ChangePassword opened={passwordOpened} onClose={closePassword} />
    </Group>
  );
}
