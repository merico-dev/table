import { ActionIcon, Button, Group, Navbar as MantineNavbar, Text, Tooltip } from '@mantine/core';
import { IconDatabase, IconFilter, IconLink, IconSettings } from '@tabler/icons';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataEditorModal } from '~/definition-editor';
import { FilterSettingsModal } from '~/filter/filter-settings';
import { InteractionsViewerModal } from '~/interactions/interactions-viewer';
import { ActionIconGroupStyle } from '~/styles/action-icon-group-style';
import { SwitchViews } from '../switch-views';

export function DashboardEditorNavbar() {
  const [dataEditorOpened, setDataEditorOpened] = useState(false);
  const openQueries = () => setDataEditorOpened(true);
  const closeQueries = () => setDataEditorOpened(false);

  const [filtersOpened, setFiltersOpened] = useState(false);
  const openFilters = () => setFiltersOpened(true);
  const closeFilters = () => setFiltersOpened(false);

  const [interactionsOpened, setInteractionsOpened] = useState(false);
  const openInteractions = () => setInteractionsOpened(true);
  const closeInteractions = () => setInteractionsOpened(false);

  return (
    <MantineNavbar p={0} width={{ base: 200 }}>
      <MantineNavbar.Section>
        <Group
          grow
          spacing={0}
          sx={{ ...ActionIconGroupStyle, button: { borderWidth: 0, borderBottomWidth: 1, borderColor: '#e9ecef' } }}
        >
          <Tooltip label="Filters" withinPortal>
            <ActionIcon variant="default" radius={0} size="md" onClick={openFilters}>
              <IconFilter size={20} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Data Settings" withinPortal>
            <ActionIcon variant="default" radius={0} size="md" onClick={openQueries}>
              <IconDatabase size={20} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Interactions Viewer" withinPortal>
            <ActionIcon variant="default" radius={0} size="md" onClick={openInteractions}>
              <IconLink size={20} />
            </ActionIcon>
          </Tooltip>
        </Group>
        <FilterSettingsModal opened={filtersOpened} close={closeFilters} />
        <DataEditorModal opened={dataEditorOpened} close={closeQueries} />
        <InteractionsViewerModal opened={interactionsOpened} close={closeInteractions} />
      </MantineNavbar.Section>

      <MantineNavbar.Section grow mt={10} sx={{ width: '100%', overflow: 'auto' }}>
        <SwitchViews />
      </MantineNavbar.Section>

      <MantineNavbar.Section>
        <Group grow p="md" pt="sm" sx={{ borderTop: '1px solid #eee' }}>
          <Button size="sm" leftIcon={<IconSettings size={20} />}>
            Settings
          </Button>
        </Group>
      </MantineNavbar.Section>
    </MantineNavbar>
  );
}
