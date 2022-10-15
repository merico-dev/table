import { Button, Group } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { Controller, useForm } from 'react-hook-form';
import { ViewModelInstance } from '..';
import { useModelContext } from '../contexts/model-context';
import { Filter } from './filter';

export const Filters = observer(function _Filters({ view }: { view: ViewModelInstance }) {
  const model = useModelContext();

  const { control, handleSubmit } = useForm({ defaultValues: model.filters.values });

  const filters = model.filters.visibleInView(view.id);
  if (filters.length === 0) {
    return null;
  }

  return (
    <form onSubmit={handleSubmit(model.filters.setValues)}>
      <Group
        className="dashboard-filters"
        position="apart"
        p="md"
        noWrap
        sx={{ border: '1px solid #ced4da', borderRadius: '4px' }}
      >
        <Group align="flex-start">
          {filters.map((filter) => (
            <Controller
              key={filter.id}
              name={filter.key}
              control={control}
              render={({ field }) => <Filter filter={filter} {...field} />}
            />
          ))}
        </Group>
        <Group sx={{ alignSelf: 'flex-end' }}>
          <Button color="blue" size="sm" type="submit">
            Submit
          </Button>
        </Group>
      </Group>
    </form>
  );
});
