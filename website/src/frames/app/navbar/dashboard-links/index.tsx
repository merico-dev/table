import { Accordion, Box, Divider, LoadingOverlay } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { useDashboardStore } from '../../models/dashboard-store-context';
import { EditDashboardModal } from './action-menu/edit-dashboard';
import { OverwriteWithJSONModal } from './action-menu/overwrite-with-json';
import { DashboardLink } from './dashboard-link';

function _DashboardLinks() {
  const { store } = useDashboardStore();

  const [id, setID] = useState('');

  const [overwriteModalOpened, setOverwriteModalOpened] = useState(false);
  const openOverwriteModal = (id: string) => {
    setID(id);
    setOverwriteModalOpened(true);
  };
  const closeOverwriteModal = () => {
    setID('');
    setOverwriteModalOpened(false);
  };

  const [editModalOpened, setEditModalOpened] = useState(false);
  const openEditModal = (id: string) => {
    setID(id);
    setEditModalOpened(true);
  };
  const closeEditModal = () => {
    setID('');
    setEditModalOpened(false);
  };

  const [activeAccordion, setActiveAccordion] = useState<string | null>(store.currentGroup);
  useEffect(() => setActiveAccordion(store.currentGroup), [store.currentGroup]);

  return (
    <Box pt="sm" pr="sm" sx={{ position: 'relative', minHeight: '60px' }}>
      <LoadingOverlay visible={store.loading} />
      <Accordion
        chevronPosition="left"
        variant="separated"
        value={activeAccordion}
        onChange={setActiveAccordion}
        styles={{
          control: {
            padding: '12px 4px',
          },
          content: {
            paddingLeft: 0,
            paddingRight: 0,
            paddingBottom: 0,
          },
        }}
      >
        {Object.entries(store.groupedList).map(([group, list]) => {
          return (
            <Accordion.Item key={group} value={group}>
              <Accordion.Control>{group}</Accordion.Control>
              <Accordion.Panel>
                {[...list].map((d) => (
                  <DashboardLink
                    preset={d.is_preset}
                    key={d.id}
                    active={store.currentID === d.id}
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
      <Divider mt={20} variant="dashed" label="Ungrouped" labelPosition="center" />
      {[...store.strayList].map((d) => (
        <DashboardLink
          preset={d.is_preset}
          key={d.id}
          active={store.currentID === d.id}
          {...d}
          openOverwriteModal={openOverwriteModal}
          openEditModal={openEditModal}
        />
      ))}
      <EditDashboardModal id={id} opened={editModalOpened} close={closeEditModal} />
      <OverwriteWithJSONModal id={id} opened={overwriteModalOpened} close={closeOverwriteModal} />
    </Box>
  );
}

export const DashboardLinks = observer(_DashboardLinks);
