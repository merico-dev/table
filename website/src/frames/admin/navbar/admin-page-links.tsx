import { Box, Group, Text, UnstyledButton } from '@mantine/core';
import { useLocation, useNavigate } from 'react-router-dom';
import { LinkType, adminPageLinks } from '../page-links';

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

export function AdminPageLinks() {
  const location = useLocation();
  const isLinkActive = (link: LinkType) => {
    return link.to === location.pathname;
  };
  return (
    <Box pt="sm" sx={{ position: 'relative' }}>
      {adminPageLinks.map((link) => (
        <AdminPageLink key={link.to} active={isLinkActive(link)} {...link} />
      ))}
    </Box>
  );
}
