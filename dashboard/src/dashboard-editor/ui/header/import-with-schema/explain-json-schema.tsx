import { Box, Divider, List, Stack, Table, Text } from '@mantine/core';
import { IconPointFilled } from '@tabler/icons-react';
import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { TDashboardContent } from '~/types';

const CustomTable = ({ headers, rows }: { headers: ReactNode; rows: ReactNode }) => {
  return (
    <Table fz="xs" highlightOnHover sx={{ tableLayout: 'fixed', fontFamily: 'monospace' }}>
      <thead>{headers}</thead>
      <tbody>{rows}</tbody>
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
          <tr>
            <th style={{ width: '160px' }}>{t('common.id')}</th>
            <th>{t('common.name')}</th>
            <th>{t('common.type')}</th>
          </tr>
        }
        rows={list.map((v) => (
          <tr key={v.id}>
            <td>{v.id}</td>
            <td>{v.name}</td>
            <td>{t(`view.component.${v.type}.label`)}</td>
          </tr>
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
          <tr>
            <th style={{ width: '160px' }}>{t('common.id')}</th>
            <th>{t('common.key')}</th>
            <th>{t('common.label')}</th>
          </tr>
        }
        rows={filters.map((f) => (
          <tr key={f.id}>
            <td>{f.id}</td>
            <td>{f.key}</td>
            <td>{f.label}</td>
          </tr>
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
          <tr>
            <th style={{ width: '160px' }}>{t('common.id')}</th>
            <th>{t('common.name')}</th>
            <th>{t('visualization.component')}</th>
          </tr>
        }
        rows={panels.map((p) => (
          <tr key={p.id}>
            <td>{p.id}</td>
            <td>{p.name}</td>
            <td>{p.viz.type}</td>
          </tr>
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
          <tr>
            <th style={{ width: '160px' }}>{t('common.id')}</th>
            <th>{t('common.name')}</th>
            <th style={{ width: '140px' }}>{t('common.type')}</th>
            <th style={{ width: '260px' }}>{t('data_source.label')}</th>
          </tr>
        }
        rows={queries.map((q) => (
          <tr key={q.id}>
            <td>{q.id}</td>
            <td>{q.name}</td>
            <td>{q.type}</td>
            <td>{q.key}</td>
          </tr>
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
      <Text ta="left" c="dimmed">
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
