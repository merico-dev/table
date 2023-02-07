import { Accordion, Box, LoadingOverlay } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { useDashboardStore } from '../../models/dashboard-store';
import { EditDashboardModal } from './action-menu/edit-dashboard';
import { OverwriteWithJSONModal } from './action-menu/overwrite-with-json';
import { DashboardLink } from './dashboard-link';

function _DashboardLinks() {
  const { store } = useDashboardStore();

  const [id, setID] = useState('');
  const [name, setName] = useState('');

  const [overwriteModalOpened, setOverwriteModalOpened] = useState(false);
  const openOverwriteModal = (id: string, name: string) => {
    setID(id);
    setName(name);
    setOverwriteModalOpened(true);
  };
  const closeOverwriteModal = () => {
    setID('');
    setName('');
    setOverwriteModalOpened(false);
  };

  const [editModalOpened, setEditModalOpened] = useState(false);
  const openEditModal = (id: string, name: string) => {
    setID(id);
    setName(name);
    setEditModalOpened(true);
  };
  const closeEditModal = () => {
    setID('');
    setName('');
    setEditModalOpened(false);
  };

  return (
    <Box pt="sm" sx={{ position: 'relative', minHeight: '60px' }}>
      <LoadingOverlay visible={store.loading} />
      <Accordion chevronPosition="left" defaultValue="TODO">
        {Object.entries(store.groupedList).map(([group, list]) => {
          return (
            <Accordion.Item key={group} value={group}>
              <Accordion.Control>{group}</Accordion.Control>
              <Accordion.Panel>
                {[...list].map((d) => (
                  <DashboardLink
                    preset={d.is_preset}
                    key={d.id}
                    active={store.current?.id === d.id}
                    {...d}
                    openOverwriteModal={openOverwriteModal}
                    openEditModal={openEditModal}
                  />
                ))}
              </Accordion.Panel>
            </Accordion.Item>
          );
        })}
      </Accordion>
      {[...store.strayList].map((d) => (
        <DashboardLink
          preset={d.is_preset}
          key={d.id}
          active={store.current?.id === d.id}
          {...d}
          openOverwriteModal={openOverwriteModal}
          openEditModal={openEditModal}
        />
      ))}
      <EditDashboardModal id={id} opened={editModalOpened} close={closeEditModal} />
      <OverwriteWithJSONModal id={id} name={name} opened={overwriteModalOpened} close={closeOverwriteModal} />
    </Box>
  );
}

export const DashboardLinks = observer(_DashboardLinks);
