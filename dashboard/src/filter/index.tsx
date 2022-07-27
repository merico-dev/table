import { Button, Group } from "@mantine/core";
import _ from "lodash";
import React from "react";
import { IDashboardFilter, IFilterConfig_Select } from "../types";
import { Filter } from "./filter";

const mockFilters: IDashboardFilter[] = [
  {
    key: 'repo_id',
    name: 'Repository',
    type: 'select',
    config: {
      multiple: true,
      static_options: [
        {
          label: 'Repo A',
          value: 'repo_a',
        },
        {
          label: 'Repo B',
          value: 'repo_b',
        },
        {
          label: 'Repo C',
          value: 'repo_c',
        },
      ]
    } as IFilterConfig_Select
  }
]

interface IFilters {
  filters?: IDashboardFilter[];
  values?: Record<string, any>;
}

export function Filters({ filters = mockFilters, values = {} }: IFilters) {
  const hasChanges = true;
  return (
    <Group className="dashboard-filters" position="apart" p="md" mb="md" sx={{ boxShadow: '0px 0px 10px 0px rgba(0,0,0,.2)' }}>
      <Group align="flex-start">
        {filters.map((filter) => <Filter filter={filter} />)}
      </Group>
      <Group sx={{ alignSelf: 'flex-end' }}>
        <Button disabled={!hasChanges} color="blue" size="sm" onClick={_.noop}>Submit</Button>
      </Group>
    </Group>
  )
}