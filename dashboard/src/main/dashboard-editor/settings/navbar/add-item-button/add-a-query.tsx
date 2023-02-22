import { Button } from '@mantine/core';
import { IconPlus } from '@tabler/icons';
import { observer } from 'mobx-react-lite';
import { useModelContext } from '~/contexts';
import { QueryModelInstance } from '~/model';
import { DataSourceType } from '~/model/queries/types';

export const AddAQuery = observer(() => {
  const model = useModelContext();
  const add = () => {
    const id = new Date().getTime().toString();
    const v = {
      id,
      name: id,
      type: DataSourceType.Postgresql,
      key: '',
      sql: '',
    } as QueryModelInstance;
    model.queries.append(v);
  };

  return (
    <Button
      variant="subtle"
      leftIcon={<IconPlus size={14} />}
      size="sm"
      px="xs"
      mb={10}
      color="blue"
      onClick={add}
      sx={{ width: '100%', borderRadius: 0 }}
      styles={{
        inner: {
          justifyContent: 'flex-start',
        },
      }}
    >
      Add a Query
    </Button>
  );
});
