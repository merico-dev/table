import { Sx, Table } from '@mantine/core';
import { PresenceDataItem } from './types';
import { AccountTypeIcon } from '../../../../components/account-type-icon';

const tableSx: Sx = {
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
      <caption>This dashboard is being edited in {total} tabs</caption>
      <colgroup>
        <col style={{ width: '40px' }} />
        <col style={{}} />
        <col style={{ width: '120px' }} />
      </colgroup>
      <thead>
        <tr>
          <th></th>
          <th>Name</th>
          <th>Browser tabs</th>
        </tr>
      </thead>
      <tbody>
        {presence.map((item) => (
          <tr key={item.id}>
            <td>
              <AccountTypeIcon type={item.type} />
            </td>
            <th title={item.name}>{item.name}</th>
            <td>{item.count}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};
