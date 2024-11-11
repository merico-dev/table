import { Button } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { observer } from 'mobx-react-lite';
import { QueryModelInstance } from '~/dashboard-editor/model';
import { MericoIconPlay } from './merico-icons';

type Props = {
  queryModel: QueryModelInstance;
};
export const RunQuery = observer(({ queryModel }: Props) => {
  return (
    <Button
      size="xs"
      leftSection={<MericoIconPlay width={14} height={14} />}
      variant="filled"
      color="red"
      onClick={() => showNotification({ message: 'TODO' })}
    >
      执行查询
    </Button>
  );
});
