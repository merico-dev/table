import { Box, Button, HoverCard, List, Text, Tooltip } from '@mantine/core';
import { IconAlertTriangle, IconDiscountCheckFilled, IconHierarchy, IconPointFilled } from '@tabler/icons-react';
import _ from 'lodash';
import { observer } from 'mobx-react-lite';
import { useMemo } from 'react';
import { QueryRenderModelInstance } from '~/model';

export const QueryDependency = observer(({ queryModel }: { queryModel: QueryRenderModelInstance }) => {
  const groupedDependencies = useMemo(() => {
    return _.groupBy(queryModel.dependencies, 'type');
  }, [queryModel.dependencies]);

  const hasUnmetDependencies = useMemo(() => {
    return queryModel.dependencies.some((d) => !d.valid);
  }, [queryModel.dependencies]);

  const hasDependency = queryModel.dependencies.length > 0;
  if (!hasDependency) {
    return (
      <Tooltip label="This query has no dependency">
        <Button
          size="xs"
          variant="subtle"
          color="gray"
          leftIcon={<IconHierarchy size={16} style={{ transform: 'rotate(180deg)' }} />}
          sx={{ transform: 'none !important' }}
        >
          Dependency
        </Button>
      </Tooltip>
    );
  }

  return (
    <HoverCard withinPortal zIndex={340} shadow="md" disabled={!hasDependency}>
      <HoverCard.Target>
        <Button
          size="xs"
          variant="subtle"
          color={hasUnmetDependencies ? 'red' : 'green'}
          disabled={!hasDependency}
          leftIcon={hasUnmetDependencies ? <IconAlertTriangle size={16} /> : <IconDiscountCheckFilled size={16} />}
        >
          Dependency
        </Button>
      </HoverCard.Target>
      <HoverCard.Dropdown>
        <List spacing="md" size={14} listStyleType="none">
          {Object.entries(groupedDependencies).map(([type, arr]) => (
            <List.Item key={type}>
              <Text fw="bold" ff="monospace">
                {type}
              </Text>
              <List withPadding size={14} sx={{ fontFamily: 'monospace', svg: { verticalAlign: 'middle' } }}>
                {arr.map((info) => (
                  <List.Item
                    key={info.key}
                    icon={
                      <Box
                        sx={{
                          path: {
                            fill: info.valid ? 'rgb(18, 184, 134)' : 'rgb(250, 82, 82)',
                          },
                        }}
                      >
                        <IconPointFilled size={12} />
                      </Box>
                    }
                  >
                    {info.key}
                  </List.Item>
                ))}
              </List>
            </List.Item>
          ))}
        </List>
      </HoverCard.Dropdown>
    </HoverCard>
  );
});
