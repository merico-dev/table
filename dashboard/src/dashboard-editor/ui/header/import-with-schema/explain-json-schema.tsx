import { Box, Divider, List, Stack, Table, Text } from '@mantine/core';
import { IconPointFilled } from '@tabler/icons-react';
import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { TDashboardContent } from '~/types';

const CustomTable = ({ headers, rows }: { headers: ReactNode; rows: ReactNode }) => {
  return (
    <Table fz="xs" highlightOnHover sx={{ tableLayout: 'fixed', fontFamily: 'monospace' }}>
      <Table.Thead>{headers}</Table.Thead>
      <Table.Tbody>{rows}</Table.Tbody>
    </Table>
  );
};

type Props = {
  content: Partial<TDashboardContent>;
};

const Views = ({ content }: Props) => {
  const { t } = useTranslation();
  const list = content.views;
  if (!Array.isArray(list) || list.length === 0) {
    return null;
  }

  return (
    <Box>
      <Text pl={10} size="sm" fw={500} c="dimmed" ta="center">
        {t('view.labels')}
      </Text>
      <CustomTable
        headers={
          <Table.Tr>
            <Table.Th style={{ width: '160px' }}>{t('common.id')}</Table.Th>
            <Table.Th>{t('common.name')}</Table.Th>
            <Table.Th>{t('common.type')}</Table.Th>
          </Table.Tr>
        }
        rows={list.map((v) => (
          <Table.Tr key={v.id}>
            <Table.Td>{v.id}</Table.Td>
            <Table.Td>{v.name}</Table.Td>
            <Table.Td>{t(`view.component.${v.type}.label`)}</Table.Td>
          </Table.Tr>
        ))}
      />
    </Box>
  );
};

const Filters = ({ content }: Props) => {
  const { t } = useTranslation();
  const filters = content.filters;
  if (!Array.isArray(filters) || filters.length === 0) {
    return null;
  }

  return (
    <Box>
      <Text pl={10} size="sm" fw={500} c="dimmed" ta="center">
        {t('filter.labels')}
      </Text>
      <CustomTable
        headers={
          <Table.Tr>
            <Table.Th style={{ width: '160px' }}>{t('common.id')}</Table.Th>
            <Table.Th>{t('common.key')}</Table.Th>
            <Table.Th>{t('common.label')}</Table.Th>
          </Table.Tr>
        }
        rows={filters.map((f) => (
          <Table.Tr key={f.id}>
            <Table.Td>{f.id}</Table.Td>
            <Table.Td>{f.key}</Table.Td>
            <Table.Td>{f.label}</Table.Td>
          </Table.Tr>
        ))}
      />
    </Box>
  );
};

const Panels = ({ content }: Props) => {
  const { t } = useTranslation();
  const panels = content.panels;
  if (!Array.isArray(panels) || panels.length === 0) {
    return null;
  }

  return (
    <Box>
      <Text pl={10} size="sm" fw={500} c="dimmed" ta="center">
        {t('panel.labels')}
      </Text>
      <CustomTable
        headers={
          <Table.Tr>
            <Table.Th style={{ width: '160px' }}>{t('common.id')}</Table.Th>
            <Table.Th>{t('common.name')}</Table.Th>
            <Table.Th>{t('visualization.component')}</Table.Th>
          </Table.Tr>
        }
        rows={panels.map((p) => (
          <Table.Tr key={p.id}>
            <Table.Td>{p.id}</Table.Td>
            <Table.Td>{p.name}</Table.Td>
            <Table.Td>{p.viz.type}</Table.Td>
          </Table.Tr>
        ))}
      />
    </Box>
  );
};

const Queries = ({ content }: Props) => {
  const { t } = useTranslation();
  const queries = content.definition?.queries;
  if (!Array.isArray(queries) || queries.length === 0) {
    return null;
  }

  return (
    <Box>
      <Text pl={10} size="sm" fw={500} c="dimmed" ta="center">
        {t('query.labels')}
      </Text>
      <CustomTable
        headers={
          <Table.Tr>
            <Table.Th style={{ width: '160px' }}>{t('common.id')}</Table.Th>
            <Table.Th>{t('common.name')}</Table.Th>
            <Table.Th style={{ width: '140px' }}>{t('common.type')}</Table.Th>
            <Table.Th style={{ width: '260px' }}>{t('data_source.label')}</Table.Th>
          </Table.Tr>
        }
        rows={queries.map((q) => (
          <Table.Tr key={q.id}>
            <Table.Td>{q.id}</Table.Td>
            <Table.Td>{q.name}</Table.Td>
            <Table.Td>{q.type}</Table.Td>
            <Table.Td>{q.key}</Table.Td>
          </Table.Tr>
        ))}
      />
    </Box>
  );
};

const SQLSnippets = ({ content }: Props) => {
  const { t } = useTranslation();
  const list = content.definition?.sqlSnippets;
  if (!Array.isArray(list) || list.length === 0) {
    return null;
  }

  return (
    <Box>
      <Text pl={10} size="sm" fw={500} c="dimmed" ta="center">
        {t('sql_snippet.labels')}
      </Text>
      <List size="sm" pl={10} ff="monospace" icon={<IconPointFilled size={10} />}>
        {list.map((s) => (
          <List.Item key={s.key}>{s.key}</List.Item>
        ))}
      </List>
    </Box>
  );
};

const MockContext = ({ content }: Props) => {
  const { t } = useTranslation();
  const list = Object.keys(content.definition?.mock_context ?? {});
  if (list.length === 0) {
    return null;
  }

  return (
    <Box>
      <Text pl={10} size="sm" fw={500} c="dimmed" ta="center">
        {t('mock_context.label')}
      </Text>
      <List size="sm" pl={10} ff="monospace" icon={<IconPointFilled size={10} />}>
        {list.map((s) => (
          <List.Item key={s}>{s}</List.Item>
        ))}
      </List>
    </Box>
  );
};

export const ExplainJSONSchema = ({ content }: { content: Partial<TDashboardContent> | null }) => {
  if (!content) {
    return null;
  }

  return (
    <Box>
      <Divider mt={20} mb={10} variant="dashed" />
      <Text ta="left" c="dimmed" size="sm">
        Preview
      </Text>
      <Stack>
        <Views content={content} />
        <Filters content={content} />
        <Panels content={content} />
        <Queries content={content} />
        <SQLSnippets content={content} />
        <MockContext content={content} />
      </Stack>
    </Box>
  );
};
