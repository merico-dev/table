import { Box, Button, HoverCard, List } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { observer } from 'mobx-react-lite';
import { QueryModelInstance } from '~/dashboard-editor/model';
import { MericoIconPlay } from './merico-icons';

type Props = {
  queryModel: QueryModelInstance;
};
export const RunQuery = observer(({ queryModel }: Props) => {
  const errors = queryModel.metricQueryPayloadError;
  if (errors.length > 0) {
    return (
      <HoverCard shadow="md">
        <HoverCard.Target>
          <Box>
            <Button
              size="xs"
              leftSection={<MericoIconPlay width={14} height={14} color="rgb(173, 181, 189)" />}
              variant="filled"
              color="red"
              disabled
            >
              执行查询
            </Button>
          </Box>
        </HoverCard.Target>
        <HoverCard.Dropdown>
          <List size="xs">
            {errors.map((err) => (
              <List.Item key={err}>{err}</List.Item>
            ))}
          </List>
        </HoverCard.Dropdown>
      </HoverCard>
    );
  }
  return (
    <Button
      size="xs"
      leftSection={<MericoIconPlay width={14} height={14} />}
      variant="filled"
      color="red"
      onClick={() => queryModel.fetchData(true)}
    >
      执行查询
    </Button>
  );
});
