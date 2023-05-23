import { Button, HoverCard, Sx, Table, Text } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons';
import { IRegressionChartConf } from '../../type';
import numbro from 'numbro';
import { useMemo } from 'react';
import { getRegressionDescription } from './desc';

const TableSx: Sx = {
  'tbody th, tbody td': {
    padding: '7px 10px',
  },
  'tbody tr:not(:first-of-type) th': {
    borderTop: '1px solid #dee2e6',
  },
};

export interface IRegressionDescription {
  conf: IRegressionChartConf;
  data: TVizData;
}

export function RegressionDescription({ conf, data }: IRegressionDescription) {
  const { expression, rSquared, adjustedRSquared } = useMemo(() => {
    return getRegressionDescription(data, conf);
  }, [conf, data]);

  return (
    <HoverCard shadow="md" withinPortal zIndex={320}>
      <HoverCard.Target>
        <Button size="xs" variant="subtle" compact leftIcon={<IconInfoCircle size={14} />}>
          Regression Info
        </Button>
      </HoverCard.Target>
      <HoverCard.Dropdown>
        <Table fontSize={14} sx={TableSx}>
          <tbody>
            {expression && (
              <tr>
                <td colSpan={2}>
                  <Text align="center">{expression}</Text>
                </td>
              </tr>
            )}
            {rSquared && (
              <>
                <tr>
                  <td>R-Sq</td>
                  <td style={{ textAlign: 'right' }}>{numbro(rSquared).format({ output: 'percent', mantissa: 1 })}</td>
                </tr>
                <tr>
                  <td>R-Sq(Adjusted)</td>
                  <td style={{ textAlign: 'right' }}>
                    {numbro(adjustedRSquared).format({ output: 'percent', mantissa: 1 })}
                  </td>
                </tr>
              </>
            )}
          </tbody>
        </Table>
      </HoverCard.Dropdown>
    </HoverCard>
  );
}
