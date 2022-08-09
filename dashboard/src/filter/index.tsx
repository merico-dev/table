import { Button, Group } from '@mantine/core';
import _ from 'lodash';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { FilterModelInstance } from '../model';
import { Filter } from './filter';

interface IFilters {
  filters: FilterModelInstance[];
  filterValues: Record<string, any>;
  setFilterValues: (v: Record<string, any>) => void;
}

export function Filters({ filters, filterValues, setFilterValues }: IFilters) {
  const { control, handleSubmit } = useForm({ defaultValues: filterValues });
  const filtersInOrder = React.useMemo(() => {
    return _.sortBy(filters, 'order');
  }, [filters]);

  if (filters.length === 0) {
    return null;
  }

  return (
    <form onSubmit={handleSubmit(setFilterValues)}>
      <Group
        className="dashboard-filters"
        position="apart"
        p="md"
        mb="md"
        noWrap
        sx={{ boxShadow: '0px 0px 10px 0px rgba(0,0,0,.2)' }}
      >
        <Group align="flex-start">
          {filtersInOrder.map((filter) => (
            <Controller
              key={filter.key}
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
}
