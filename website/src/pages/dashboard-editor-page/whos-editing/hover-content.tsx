import { Table } from '@mantine/core';
import { PresenceDataItem } from './types';

interface IProps {
  presence: PresenceDataItem[];
}
export const HoverContent = ({ presence }: IProps) => {
  return (
    <Table highlightOnHover>
      <thead>
        <tr>
          <th>Name</th>
          <th>Sessions</th>
        </tr>
      </thead>
      <tbody>
        {presence.map((item) => (
          <tr key={item.id}>
            <th>{item.name}</th>
            <td>{item.count}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};
