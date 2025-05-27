import { Group, Pill, Table, Text } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { TSelectOption } from '~/model/meta-model/dashboard/content/filter/widgets/select-base';
import classes from './selection-table.module.css';

export const SelectionTable = ({ selection }: { selection: TSelectOption[] }) => {
  const { t } = useTranslation();
  if (selection.length === 0) {
    return null;
  }

  // return (
  //   <Table highlightOnHover withColumnBorders className={classes.table}>
  //     <Table.Thead>
  //       <Table.Tr>
  //         <Table.Th>{t('common.label')}</Table.Th>
  //         <Table.Th>{t('common.value')}</Table.Th>
  //       </Table.Tr>
  //     </Table.Thead>
  //     <Table.Tbody>
  //       {selection.map((s) => (
  //         <Table.Tr key={s.value}>
  //           <Table.Td>{s.label}</Table.Td>
  //           <Table.Td>{s.value}</Table.Td>
  //         </Table.Tr>
  //       ))}
  //     </Table.Tbody>
  //   </Table>
  // );

  return (
    <Group justify="flex-start" gap="xs" maw="80vw">
      {selection.map((s) => (
        <Pill key={s.value} size="xs" ff="monospace">
          {s.label}
        </Pill>
      ))}
    </Group>
  );
};
