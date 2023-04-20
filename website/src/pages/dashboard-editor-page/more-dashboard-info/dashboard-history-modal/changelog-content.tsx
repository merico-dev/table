import { ActionIcon, Box, Group, LoadingOverlay, Navbar as MantineNavbar, Stack, Text } from '@mantine/core';
import { IconArrowLeft, IconArrowRight } from '@tabler/icons';
import { observer } from 'mobx-react-lite';
import { useEffect, useMemo, useState } from 'react';
import { ListDashboardChangelogRespType } from '../../../../api-caller/dashboard-changelog.types';
import { ReadonlyMonacoEditor } from '../../../../components/readonly-monaco-editor';
import { ErrorBoundary } from '../../../../utils/error-boundary';
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
      <ActionIcon variant="subtle" color="blue" onClick={prev} disabled={loading || page === 0} radius={0}>
        <IconArrowLeft size={18} />
      </ActionIcon>
      <ActionIcon variant="subtle" color="blue" onClick={next} disabled={loading || page === maxPage} radius={0}>
        <IconArrowRight size={18} />
      </ActionIcon>
    </Group>
  );
};

interface IChangelogContent {
  resp: ListDashboardChangelogRespType;
  loading: boolean;
  page: number;
  maxPage: number;
  setPage: (v: number) => void;
}
export const ChangelogContent = observer(({ resp, page, setPage, loading, maxPage }: IChangelogContent) => {
  const [currentChangelogID, setCurrentChangelogID] = useState<string>('');

  const { data } = resp;

  const current = useMemo(() => {
    return data.find((d) => d.id === currentChangelogID);
  }, [data, currentChangelogID]);

  useEffect(() => {
    if (Array.isArray(data) && data.length > 0 && !currentChangelogID) {
      setCurrentChangelogID(data[0].id);
    }
  }, [data, currentChangelogID]);

  if (maxPage === 0) {
    return (
      <Text mt={20} color="red" size="md" align="center" sx={{ fontFamily: 'monospace' }}>
        This table is empty
      </Text>
    );
  }
  return (
    <ErrorBoundary>
      <Box p={0} sx={{ width: '100%', height: '100%', overflow: 'auto', position: 'relative' }}>
        <MantineNavbar p={0} mt={-1} width={{ base: 185 }}>
          <MantineNavbar.Section py={0} sx={{ borderBottom: '1px solid #eee' }}>
            <PaginationSection page={page} setPage={setPage} maxPage={maxPage} loading={loading} />
          </MantineNavbar.Section>
          <MantineNavbar.Section grow sx={{ position: 'relative', overflow: 'auto' }}>
            <LoadingOverlay visible={loading} overlayBlur={2} />
            <ChangelogNavLinks data={data} currentChangelogID={currentChangelogID} onClick={setCurrentChangelogID} />
          </MantineNavbar.Section>
        </MantineNavbar>
        <Stack sx={{ position: 'relative', paddingLeft: 185, height: '100%' }}>
          {current && <ReadonlyMonacoEditor defaultLanguage="diff" value={current.diff} height="100%" />}
        </Stack>
      </Box>
    </ErrorBoundary>
  );
});
