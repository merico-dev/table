import { Anchor, Box, Stack, Table } from '@mantine/core';
import _ from 'lodash';
import { observer } from 'mobx-react-lite';
import { useEditDashboardContext } from '~/contexts';
import { QueryUsageType } from '~/model';

interface IQueryUsage {
  queryID: string;
  usage: QueryUsageType[];
}

export const QueryUsage = observer(({ queryID, usage }: IQueryUsage) => {
  const editor = useEditDashboardContext().editor;
  const open = (u: QueryUsageType) => {
    if (u.type === 'filter') {
      editor.setPath(['_FILTERS_', u.id]);
      return;
    }

    if (u.type === 'panel') {
      const viewID = u.views[0].id;
      editor.setPath(['_VIEWS_', viewID, '_PANELS_', u.id]);
      return;
    }
  };
  const openView = (id: string) => {
    editor.setPath(['_VIEWS_', id]);
  };
  return (
    <Stack py="sm" px="md">
      <Table highlightOnHover sx={{ tableLayout: 'fixed' }}>
        <thead>
          <tr>
            <th style={{ width: 100 }}>Type</th>
            <th style={{ width: 'calc(50% - 50px)' }}>Name</th>
            <th>In View(s)</th>
          </tr>
        </thead>
        <tbody>
          {usage.map((u) => (
            <tr key={u.id}>
              <td>{_.capitalize(u.type)}</td>
              <td>
                <Anchor component="button" type="button" onClick={() => open(u)}>
                  {u.label}
                </Anchor>
              </td>
              <td>
                <Stack align="flex-start" justify="flex-start" spacing={2}>
                  {u.views.map((v) => (
                    <Anchor component="button" type="button" onClick={() => openView(v.id)}>
                      <Box>{v.label}</Box>
                    </Anchor>
                  ))}
                  {u.views.length === 0 && <Box>--</Box>}
                </Stack>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Stack>
  );
});
