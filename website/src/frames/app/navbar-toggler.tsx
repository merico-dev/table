import { ActionIcon, Tooltip } from '@mantine/core';
import { IconLayoutSidebar } from '@tabler/icons-react';

export const NavbarToggler = ({ collapsed, expand }: { collapsed: boolean; expand: () => void }) => {
  if (!collapsed) {
    return null;
  }
  return (
    <Tooltip label="Show sidebar">
      <ActionIcon size="xs" color="blue" onClick={expand}>
        <IconLayoutSidebar />
      </ActionIcon>
    </Tooltip>
  );
};
