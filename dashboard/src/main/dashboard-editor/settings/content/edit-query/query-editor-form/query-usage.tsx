import { Button, Stack, Table } from '@mantine/core';
import _ from 'lodash';
import { observer } from 'mobx-react-lite';
import { useModelContext } from '~/contexts';

type UsageType =
  | { type: 'filter'; id: string; label: string }
  | { type: 'panel'; id: string; label: string; viewID: string };

interface IQueryUsage {
  queryID: string;
  usage: UsageType[];
}

export const QueryUsage = observer(({ queryID, usage }: IQueryUsage) => {
  const editor = useModelContext().editor;
  const open = (u: UsageType) => {
    if (u.type === 'filter') {
      editor.setPath(['_FILTERS_', u.id]);
      return;
    }

    if (u.type === 'panel') {
      editor.setPath(['_VIEWS_', u.viewID, '_PANELS_', u.id]);
      return;
    }
  };
  return (
    <Stack py="sm" px="md">
      <Table highlightOnHover>
        <thead>
          <tr>
            <th>Type</th>
            <th>Name / Label</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {usage.map((u) => (
            <tr key={u.id}>
              <td>{_.capitalize(u.type)}</td>
              <td>{u.label}</td>
              <td>
                <Button compact variant="subtle" onClick={() => open(u)}>
                  Open
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Stack>
  );
});
