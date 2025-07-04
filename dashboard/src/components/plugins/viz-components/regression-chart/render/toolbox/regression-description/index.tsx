import { Button, HoverCard, Table, Tabs, Text } from '@mantine/core';
import { EmotionSx } from '@mantine/emotion';
import { IconInfoCircle } from '@tabler/icons-react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ErrorBoundary, formatNumber, ParsedDataKey } from '~/utils';
import { IRegressionChartConf } from '../../../type';
import { TDescription, getRegressionDescription } from './desc';

const TableSx: EmotionSx = {
  marginTop: '10px',
  'tbody th, tbody td': {
    padding: '7px 10px',
  },
  'tbody tr:not(:first-of-type) th': {
    borderTop: '1px solid #dee2e6',
  },
};

function DescriptionContent({ desc }: { desc: TDescription }) {
  const { t } = useTranslation();
  const { expression, rSquared, adjustedRSquared } = desc;
  if (!expression) {
    return <Text size="sm">Unavailable for this regression method</Text>;
  }
  return (
    <Table fz={14} sx={TableSx}>
      <Table.Tbody>
        <Table.Tr>
          <Table.Td colSpan={2}>{expression}</Table.Td>
        </Table.Tr>
        <Table.Tr>
          <Table.Td>{t('viz.regression_chart.r_sq')}</Table.Td>
          <Table.Td style={{ textAlign: 'right' }}>
            {formatNumber(rSquared, { output: 'percent', mantissa: 1, absolute: false })}
          </Table.Td>
        </Table.Tr>
        <Table.Tr>
          <Table.Td>{t('viz.regression_chart.r_sq_adjusted')}</Table.Td>
          <Table.Td style={{ textAlign: 'right' }}>
            {formatNumber(adjustedRSquared, { output: 'percent', mantissa: 1, absolute: false })}
          </Table.Td>
        </Table.Tr>
      </Table.Tbody>
    </Table>
  );
}

export interface IRegressionDescription {
  conf: IRegressionChartConf;
  queryData: TQueryData;
  x: ParsedDataKey;
  y: ParsedDataKey;
  g: ParsedDataKey;
}

function DescriptionInTabs({ conf, queryData, x, y, g }: IRegressionDescription) {
  const desc = useMemo(() => getRegressionDescription(queryData, x, y, g, conf), [conf, queryData, x, y, g]);

  if (!g.columnKey || !g.queryID) {
    return <DescriptionContent desc={desc[0]} />;
  }

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

export function RegressionDescription({ conf, queryData, x, y, g }: IRegressionDescription) {
  const { t } = useTranslation();
  return (
    <HoverCard shadow="md" withinPortal zIndex={320}>
      <HoverCard.Target>
        <Button variant="subtle" size="compact-xs" leftSection={<IconInfoCircle size={14} />}>
          {t('viz.regression_chart.regression_info')}
        </Button>
      </HoverCard.Target>
      <HoverCard.Dropdown>
        <ErrorBoundary>
          <DescriptionInTabs conf={conf} queryData={queryData} x={x} y={y} g={g} />
        </ErrorBoundary>
      </HoverCard.Dropdown>
    </HoverCard>
  );
}
