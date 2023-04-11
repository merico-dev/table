import { ActionIcon, Sx, Table, Tooltip } from '@mantine/core';
import { IconApi, IconUser } from '@tabler/icons';
import { PresenceDataItem } from './types';

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
              <Tooltip label={item.type === 'APIKEY' ? 'API Key' : 'Account'}>
                <ActionIcon variant="subtle" sx={{ cursor: 'help', transform: 'none !important' }}>
                  {item.type === 'APIKEY' ? <IconApi size={14} /> : <IconUser size={14} />}
                </ActionIcon>
              </Tooltip>
            </td>
            <th title={item.name}>{item.name}</th>
            <td>{item.count}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};
