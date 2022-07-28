import { Button, Group } from "@mantine/core";
import _ from "lodash";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { IDashboardFilter } from "../types";
import { Filter } from "./filter";

interface IFilters {
  filters: IDashboardFilter[];
  filterValues: Record<string, any>;
  setFilterValues: (v: Record<string, any>) => void;
}

export function Filters({ filters, filterValues, setFilterValues }: IFilters) {

  const { control, handleSubmit } = useForm({ defaultValues: filterValues });

  return (
    <form onSubmit={handleSubmit(setFilterValues)}>
      <Group className="dashboard-filters" position="apart" p="md" mb="md" sx={{ boxShadow: '0px 0px 10px 0px rgba(0,0,0,.2)' }}>
        <Group align="flex-start">
          {filters.map((filter) => (
            <Controller
              name={filter.key}
              control={control}
              render={({ field }) => (
                <Filter filter={filter} {...field} />
              )}
            />
          ))}
        </Group>
        <Group sx={{ alignSelf: 'flex-end' }}>
          <Button color="blue" size="sm" type="submit">Submit</Button>
        </Group>
      </Group>
    </form>
  )
}