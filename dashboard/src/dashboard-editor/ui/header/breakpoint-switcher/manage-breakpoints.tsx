import { ActionIcon, Button, Group, Table, Tooltip } from '@mantine/core';
import { IconPlaylistAdd, IconTrash } from '@tabler/icons-react';
import { observer } from 'mobx-react-lite';
import { useEditContentModelContext } from '~/contexts';

export const ManageBreakpoints = observer(() => {
  const contentModel = useEditContentModelContext();
  const layouts = contentModel.layouts;
  const canDelete = layouts.list.length > 1;
  return (
    <>
      <Group mb={10} position="left">
        <Button variant="light" size="xs" leftIcon={<IconPlaylistAdd size={18} />} onClick={layouts.addALayoutSet}>
          Add a screen size
        </Button>
      </Group>
      <Table fontSize="sm" highlightOnHover sx={{ tableLayout: 'fixed' }}>
        <thead>
          <tr>
            <th style={{ width: '200px' }}>Name</th>
            <th style={{ width: '100px' }}>Min Width</th>
            <th style={{ width: '100px' }}>Max Width</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {layouts.breakpointRanges.map((b) => (
            <tr key={b.id}>
              <th>{b.id}</th>
              <td>{b.min}px</td>
              <td>{Number.isFinite(b.max) ? `${b.max}px` : '∞'}</td>
              <td>
                {canDelete && (
                  <Tooltip label="Delete this one">
                    <ActionIcon size="xs" variant="subtle" color="red">
                      <IconTrash />
                    </ActionIcon>
                  </Tooltip>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
});
