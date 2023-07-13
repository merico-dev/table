import { ActionIcon, Text, Button, Group, LoadingOverlay, Navbar as MantineNavbar } from '@mantine/core';
import { IconArrowLeft, IconArrowRight, IconX } from '@tabler/icons-react';
import { observer } from 'mobx-react-lite';
import { DashboardContentChangelogDBType } from '../../../../api-caller/dashboard-content-changelog.types';
import { ChangelogNavLinks } from './changelog-links';
interface IPaginationSection {
  page: number;
  maxPage: number;
  setPage: (page: number) => void;
  loading: boolean;
}
const PaginationSection = ({ page, maxPage, setPage, loading }: IPaginationSection) => {
  const prev = () => setPage(page - 1);
  const next = () => setPage(page + 1);
  return (
    <Group grow spacing={2} position="apart">
      <ActionIcon variant="subtle" color="blue" onClick={prev} disabled={loading || page === 1} radius={0}>
        <IconArrowLeft size={18} />
      </ActionIcon>
      <ActionIcon variant="subtle" color="blue" onClick={next} disabled={loading || page === maxPage} radius={0}>
        <IconArrowRight size={18} />
      </ActionIcon>
    </Group>
  );
};

interface IChangelogNavbar {
  data?: DashboardContentChangelogDBType[];
  loading: boolean;
  page: number;
  maxPage: number;
  setPage: (v: number) => void;
  close: () => void;
  currentChangelogID: string;
  setCurrentChangelogID: (v: string) => void;
}

export const ChangelogNavbar = observer(
  ({ data, page, setPage, loading, maxPage, close, currentChangelogID, setCurrentChangelogID }: IChangelogNavbar) => {
    if (!Array.isArray(data)) {
      return null;
    }
    return (
      <MantineNavbar
        p={0}
        width={{ base: 200, xs: 200, sm: 220, md: 240, lg: 280, xl: 300 }}
        sx={{ position: 'static', height: '100%', overflow: 'auto', flexGrow: 0, flexShrink: 0 }}
      >
        <MantineNavbar.Section py={0} sx={{ borderBottom: '1px solid #eee' }}>
          <PaginationSection page={page} setPage={setPage} maxPage={maxPage} loading={loading} />
        </MantineNavbar.Section>
        <MantineNavbar.Section grow sx={{ position: 'relative', overflow: 'auto' }}>
          <LoadingOverlay visible={loading} overlayBlur={2} />
          <ChangelogNavLinks data={data} currentChangelogID={currentChangelogID} onClick={setCurrentChangelogID} />
        </MantineNavbar.Section>
        <MantineNavbar.Section>
          <Group grow p="md" pt="sm" sx={{ borderTop: '1px solid #eee' }}>
            <Button size="xs" color="red" leftIcon={<IconX size={18} />} onClick={close}>
              Close
            </Button>
          </Group>
        </MantineNavbar.Section>
      </MantineNavbar>
    );
  },
);
