import { Group } from "@mantine/core";
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
}

export function Filters({ filters = mockFilters }: IFilters) {
  return (
    <Group className='dashboard-filters'>
      {filters.map((filter) => <Filter filter={filter} />)}
    </Group>
  )
}