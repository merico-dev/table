import { Box, Group, Text, UnstyledButton } from '@mantine/core';
import {
  IconClipboardCheck,
  IconClipboardCopy,
  IconDatabase,
  IconInfoCircle,
  IconKey,
  IconUsers,
} from '@tabler/icons-react';
import { useLocation, useNavigate } from 'react-router-dom';

interface IAdminPageLink {
  to: string;
  name: string;
  icon: React.ReactNode;
  active: boolean;
}

function AdminPageLink({ to, name, icon, active }: IAdminPageLink) {
  const navigate = useNavigate();
  return (
    <UnstyledButton
      sx={(theme) => ({
        display: 'block',
        width: '100%',
        padding: theme.spacing.xs,
        borderRadius: 0,
        color: theme.black,

        '&:hover': {
          backgroundColor: theme.colors.gray[0],
        },

        backgroundColor: active ? theme.colors.gray[2] : 'transparent',
      })}
      onClick={() => navigate(to)}
    >
      <Group>
        {icon}
        <Text size="sm">{name}</Text>
      </Group>
    </UnstyledButton>
  );
}

type LinkType = {
  name: string;
  to: string;
  icon: React.ReactNode;
};

const links: LinkType[] = [
  { name: 'Data Sources', to: '/admin/data_source/list', icon: <IconDatabase size={16} color="#868e96" /> },
  { name: 'SQL Snippets', to: '/admin/sql_snippet/list', icon: <IconClipboardCopy size={16} color="#868e96" /> },
  { name: 'Accounts', to: '/admin/account/list', icon: <IconUsers size={16} color="#868e96" /> },
  { name: 'API Keys', to: '/admin/api_key/list', icon: <IconKey size={16} color="#868e96" /> },
  { name: 'Status', to: '/admin/status', icon: <IconInfoCircle size={16} color="#868e96" /> },
];

export function AdminPageLinks() {
  const location = useLocation();
  const isLinkActive = (link: LinkType) => {
    return link.to === location.pathname;
  };
  return (
    <Box pt="sm" sx={{ position: 'relative' }}>
      {links.map((link) => (
        <AdminPageLink key={link.to} active={isLinkActive(link)} {...link} />
      ))}
    </Box>
  );
}
