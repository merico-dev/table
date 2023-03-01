import { Group, Header as MantineHeader } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { AccountDropdown } from '../../../components/account-dropdown';
import { Logo } from '../../../components/logo';

const _Header = () => {
  return (
    <MantineHeader height={60} px="md" py={0}>
      <Group position="apart" sx={{ height: 60 }}>
        <Group position="left">
          <Logo />
        </Group>
        <Group position="right">
          <AccountDropdown />
        </Group>
      </Group>
    </MantineHeader>
  );
};
export const Header = observer(_Header);
