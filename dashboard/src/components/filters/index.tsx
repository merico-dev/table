import { Button, Container, Group, MultiSelect } from "@mantine/core";
import { DateRangePicker } from "@mantine/dates";
import _ from "lodash";
import React from "react";
import ContextInfoContext, { TimeRange } from "../../contexts/context-info-context";
import { ContributorSelector } from "./contributor-selector";

const mock_repos = [
  { value: 'ee-frontend', label: 'ee-frontend' },
];

interface IFilters {
  submit: React.Dispatch<React.SetStateAction<Record<string, any>>>;
}

export function Filters({ submit }: IFilters) {
  const contextInfo = React.useContext(ContextInfoContext);

  const [timeRange, setTimeRange] = React.useState<TimeRange>([
    new Date(2021, 1, 1),
    new Date(),
  ]);

  const [emails, setEmails] = React.useState<string[]>([]);

  const doSubmit = React.useCallback(() => {
    submit(prev => ({
      ...prev,
      timeRange,
      emails,
    }))
  }, [submit, timeRange, emails])

  React.useEffect(doSubmit, [])

  const hasChanges = React.useMemo(() => {
    const timeRangeEq = _.isEqual(timeRange, contextInfo.timeRange)
    console.log({ timeRangeEq })
    if (!timeRangeEq) {
      return true;
    }
    const emailsEq = _.isEqual(emails, contextInfo.emails);
    console.log({ emailsEq })
    return !emailsEq;
  }, [timeRange, emails, contextInfo]);

  return (
      <Group position="apart" p="md" mb="md" sx={{ boxShadow: '0px 0px 10px 0px rgba(0,0,0,.2)' }}>
        <Group align="flex-start">
          <DateRangePicker
            label="Date Range"
            placeholder="Pick dates range"
            value={timeRange}
            onChange={setTimeRange}
            clearable={false}
            inputFormat="YYYY-MM-DD"
            sx={{ width: 240 }}
          />
          <ContributorSelector
            value={emails}
            onChange={setEmails}
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