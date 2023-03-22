import { Anchor, Box, Stack, Table } from '@mantine/core';
import _ from 'lodash';
import { observer } from 'mobx-react-lite';
import { useModelContext } from '~/contexts';
import { QueryUsageType } from '~/model';

interface IQueryUsage {
  queryID: string;
  usage: QueryUsageType[];
}

export const QueryUsage = observer(({ queryID, usage }: IQueryUsage) => {
  const editor = useModelContext().editor;
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
  return (
    <Stack py="sm" px="md">
      <Table highlightOnHover>
        <thead>
          <tr>
            <th style={{ width: 100 }}>Type</th>
            <th>Name</th>
            <th>In Views</th>
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
                <Stack spacing={2}>
                  {u.views.map((v) => (
                    <Box>{v.label}</Box>
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
