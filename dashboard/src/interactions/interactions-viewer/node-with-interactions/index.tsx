import { Box, HoverCard, List, Text } from '@mantine/core';
import { memo, useMemo } from 'react';
import { Handle, Position } from 'reactflow';
import { ChevronsUpRight } from 'tabler-icons-react';
import './index.css';
import { getInteractionLines } from './lines';

export const InteractionNode = memo(({ data, isConnectable, ...rest }: { data: any; isConnectable: boolean }) => {
  console.log(data, rest);
  const lines = useMemo(() => {
    return getInteractionLines(data.interactions);
  }, [data.interactions]);
  return (
    <>
      {/* <Handle type="target" position={Position.Left} isConnectable={isConnectable} /> */}

      <Box sx={{ position: 'absolute', top: 0, right: 0 }}>
        <ChevronsUpRight size={12} />
      </Box>
      <HoverCard shadow="xl" withinPortal>
        <HoverCard.Target>
          <Text>{data.label}</Text>
        </HoverCard.Target>
        <HoverCard.Dropdown>
          <List spacing="xs" size="sm" center>
            {lines.map((item) => (
              <List.Item key={item.key} icon={item.icon}>
                {item.text}
              </List.Item>
            ))}
          </List>
        </HoverCard.Dropdown>
      </HoverCard>

      <Handle type="source" position={Position.Right} isConnectable={isConnectable} />
    </>
  );
});
