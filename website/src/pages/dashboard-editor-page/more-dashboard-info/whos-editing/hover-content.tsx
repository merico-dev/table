import { Table } from '@mantine/core';
import { EmotionSx } from '@mantine/emotion';
import { AccountTypeIcon } from '../../../../components/account-type-icon';
import { PresenceDataItem } from './types';

const tableSx: EmotionSx = {
  tableLayout: 'fixed',
  maxWidth: '300px',
  tbody: {
    th: {
      padding: '7px 10px',
      textAlign: 'left',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
  },
  caption: {
    fontSize: '12px',
  },
};

interface IProps {
  presence: PresenceDataItem[];
  total: number;
}
export const HoverContent = ({ presence, total }: IProps) => {
  return (
    <Table highlightOnHover sx={tableSx} captionSide="bottom">
      <Table.Caption>This dashboard is being edited in {total} tabs</Table.Caption>
      <colgroup>
        <col style={{ width: '40px' }} />
        <col style={{}} />
        <col style={{ width: '120px' }} />
      </colgroup>
      <Table.Thead>
        <Table.Tr>
          <Table.Th></Table.Th>
          <Table.Th>Name</Table.Th>
          <Table.Th>Browser tabs</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {presence.map((item) => (
          <Table.Tr key={item.id}>
            <Table.Td>
              <AccountTypeIcon type={item.type} />
            </Table.Td>
            <Table.Th title={item.name}>{item.name}</Table.Th>
            <Table.Td>{item.count}</Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  );
};
