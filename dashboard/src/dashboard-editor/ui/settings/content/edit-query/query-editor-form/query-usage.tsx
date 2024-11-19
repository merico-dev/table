import { Anchor, Box, Stack, Table } from '@mantine/core';
import _ from 'lodash';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { useEditDashboardContext } from '~/contexts';
import { QueryModelInstance } from '~/dashboard-editor/model';
import { QueryUsageType } from '~/model';

type Props = {
  queryModel: QueryModelInstance;
};

export const QueryUsage = observer(({ queryModel }: Props) => {
  const { t } = useTranslation();
  const editor = useEditDashboardContext().editor;

  const open = (u: QueryUsageType) => {
    if (u.type === 'filter') {
      editor.setPath(['_FILTERS_', u.id]);
      return;
    }

    if (u.type === 'panel') {
      const viewID = u.views[0].id;
      editor.setPath(['_VIEWS_', viewID, '_PANELS_', u.id, '_TABS_', 'Data']);
      return;
    }
  };
  const openView = (id: string) => {
    editor.setPath(['_VIEWS_', id]);
  };

  const usage = queryModel.usage;
  return (
    <Table
      highlightOnHover
      layout="fixed"
      styles={{
        table: {
          fontSize: '14px',
        },
      }}
    >
      <Table.Thead>
        <Table.Tr>
          <Table.Th style={{ width: 100 }}>{t('common.type')}</Table.Th>
          <Table.Th style={{ width: 'calc(50% - 50px)' }}>{t('common.name')}</Table.Th>
          <Table.Th>{t('query.usage.in_views')}</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {usage.map((u) => (
          <Table.Tr key={u.id}>
            <Table.Td>{t(u.type_label)}</Table.Td>
            <Table.Td>
              <Anchor size="sm" component="button" type="button" onClick={() => open(u)}>
                {u.label}
              </Anchor>
            </Table.Td>
            <Table.Td>
              <Stack align="flex-start" justify="flex-start" gap={2}>
                {u.views.map((v) => (
                  <Anchor key={v.id} size="sm" component="button" type="button" onClick={() => openView(v.id)}>
                    <Box>{v.label}</Box>
                  </Anchor>
                ))}
                {u.views.length === 0 && <Box>--</Box>}
              </Stack>
            </Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  );
});
