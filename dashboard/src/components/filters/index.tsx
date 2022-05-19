import { Button, Container, Group, MultiSelect } from "@mantine/core";
import { DateRangePicker } from "@mantine/dates";
import _ from "lodash";
import React from "react";
import ContextInfoContext from "../../contexts/context-info-context";

const mock_contributors = [
  { value: 'gerile.tu@merico.dev', label: 'Leto' },
];
const mock_repos = [
  { value: 'ee-frontend', label: 'ee-frontend' },
];

interface IFilters {
  submit: React.Dispatch<React.SetStateAction<Record<string, any>>>;
}

export function Filters({ submit }: IFilters) {
  const contextInfo = React.useContext(ContextInfoContext);

  const [timeRange, setTimeRange] = React.useState<[Date | null, Date | null]>([
    new Date(2021, 1, 1),
    new Date(),
  ]);

  const doSubmit = React.useCallback(() => {
    submit(prev => ({
      ...prev,
      timeRange
    }))
  }, [submit, timeRange])

  React.useEffect(() => {
    doSubmit()
  }, [])

  const hasChanges = React.useMemo(() => {
    return !_.isEqual(timeRange, contextInfo.timeRange);
  }, [timeRange, contextInfo]);

  return (
      <Group position="apart" p="md" mb="md" sx={{ boxShadow: '0px 0px 10px 0px rgba(0,0,0,.2)' }}>
        <Group>
          <DateRangePicker
            label="Date Range"
            placeholder="Pick dates range"
            value={timeRange}
            onChange={setTimeRange}
            clearable={false}
            inputFormat="YYYY-MM-DD"
            sx={{ width: 240 }}
          />
          <MultiSelect
            data={mock_contributors}
            label="Contributors"
            value={[mock_contributors[0].value]}
            disabled
            sx={{ width: 320 }}
          />
          <MultiSelect
            data={mock_repos}
            label="Repositories"
            value={[mock_repos[0].value]}
            disabled
            sx={{ width: 320 }}
          />
        </Group>
        <Group sx={{ alignSelf: 'flex-end' }}>
          <Button disabled={!hasChanges} color="blue" size="sm" onClick={doSubmit}>Submit</Button>
        </Group>
      </Group>
  )
}