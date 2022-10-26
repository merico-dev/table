import { Group, Menu, Text, UnstyledButton } from '@mantine/core';
import { forwardRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AddressBook, ChevronRight, Logout, ShieldLock } from 'tabler-icons-react';
import { useAccountContext } from '../../frames/require-auth/account-context';

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
    navigate('/login');
  };
  return (
    <Group position="center">
      <Menu withinPortal>
        <Menu.Target>
          <UserButton username={account.name} email={account.email} />
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Label>Account Settings</Menu.Label>

          <Menu.Item icon={<AddressBook size={14} />}>Profile</Menu.Item>
          <Menu.Item icon={<ShieldLock size={14} />}>Password</Menu.Item>

          <Menu.Divider />

          <Menu.Item color="red" icon={<Logout size={14} />} onClick={logout}>
            Logout
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </Group>
  );
}
