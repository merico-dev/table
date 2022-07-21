import { Group, UnstyledButton, Text, Box } from "@mantine/core";
import { useNavigate, useParams } from "react-router-dom";

interface IAdminPageLink {
  to: string;
  name: string;
  active: boolean;
}

function AdminPageLink({ to, name, active }: IAdminPageLink) {
  const navigate = useNavigate();
  return (
    <UnstyledButton
      sx={(theme) => ({
        display: 'block',
        width: '100%',
        padding: theme.spacing.xs,
        borderRadius: theme.radius.sm,
        color: theme.black,

        '&:hover': {
          backgroundColor: theme.colors.gray[0]
        },

        backgroundColor: active ? theme.colors.gray[2] : 'transparent'
      })}
      onClick={() => navigate(to)}
    >
      <Group>
        <Text size="sm">{name}</Text>
      </Group>
    </UnstyledButton>
  );
}

const links = [
  { name: 'Data Source', to: '/admin/data_sources/list' }
]

export function AdminPageLinks() {
  return (
    <Box pt="sm" sx={{ position: 'relative' }}>
      {links.map((link) => (
        <AdminPageLink key={link.to} active={false} {...link} />
      ))}
    </Box>
  );
}