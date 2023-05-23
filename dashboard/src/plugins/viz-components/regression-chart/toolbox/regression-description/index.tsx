import { Button, HoverCard, Sx, Table, Tabs, Text } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons';
import { IRegressionChartConf } from '../../type';
import numbro from 'numbro';
import { useMemo } from 'react';
import { TDescription, getRegressionDescription } from './desc';
import { ErrorBoundary } from '~/utils/error-boundary';

const TableSx: Sx = {
  marginTop: '10px',
  'tbody th, tbody td': {
    padding: '7px 10px',
  },
  'tbody tr:not(:first-of-type) th': {
    borderTop: '1px solid #dee2e6',
  },
};

function DescriptionContent({ desc }: { desc: TDescription }) {
  const { expression, rSquared, adjustedRSquared } = desc;
  if (!expression) {
    return <Text>Unavailable for this regression method</Text>;
  }
  return (
    <Table fontSize={14} sx={TableSx}>
      <tbody>
        <tr>
          <td colSpan={2}>
            <Text align="center">{expression}</Text>
          </td>
        </tr>
        <tr>
          <td>R-Sq</td>
          <td style={{ textAlign: 'right' }}>{numbro(rSquared).format({ output: 'percent', mantissa: 1 })}</td>
        </tr>
        <tr>
          <td>R-Sq(Adjusted)</td>
          <td style={{ textAlign: 'right' }}>{numbro(adjustedRSquared).format({ output: 'percent', mantissa: 1 })}</td>
        </tr>
      </tbody>
    </Table>
  );
}

export interface IRegressionDescription {
  conf: IRegressionChartConf;
  data: TVizData;
}

function DescriptionInTabs({ conf, data }: IRegressionDescription) {
  const desc = useMemo(() => getRegressionDescription(data, conf), [conf, data]);

  if (!conf.regression.group_by_key) {
    return <DescriptionContent desc={desc[0]} />;
  }
  console.log(desc);

  return (
    <Tabs defaultValue={desc[0]?.name} color="gray">
      <Tabs.List grow>
        {desc.map((item) => (
          <Tabs.Tab key={item.name} value={item.name}>
            {item.name}
          </Tabs.Tab>
        ))}
      </Tabs.List>
      {desc.map((item) => (
        <Tabs.Panel key={item.name} value={item.name}>
          <DescriptionContent desc={item} />
        </Tabs.Panel>
      ))}
    </Tabs>
  );
}

export function RegressionDescription({ conf, data }: IRegressionDescription) {
  return (
    <HoverCard shadow="md" withinPortal zIndex={320}>
      <HoverCard.Target>
        <Button size="xs" variant="subtle" compact leftIcon={<IconInfoCircle size={14} />}>
          Regression Info
        </Button>
      </HoverCard.Target>
      <HoverCard.Dropdown>
        <ErrorBoundary>
          <DescriptionInTabs conf={conf} data={data} />
        </ErrorBoundary>
      </HoverCard.Dropdown>
    </HoverCard>
  );
}
