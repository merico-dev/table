import { Button, Group } from "@mantine/core";
import { DateRangePicker } from "@mantine/dates";
import _ from "lodash";
import React from "react";
import { ContextInfoContext, ContextInfoContextType, TimeRange } from "dashboard";
import { ContributorSelector } from "./contributor-selector";
import { RepositorySelector } from "./repository-selector";

interface IFilters {
  submit: React.Dispatch<React.SetStateAction<ContextInfoContextType>>;
}

export function Filters({ submit }: IFilters) {
  const contextInfo = React.useContext(ContextInfoContext);

  const [timeRange, setTimeRange] = React.useState<TimeRange>([
    new Date(2021, 1, 1),
    new Date(),
  ]);

  const [emails, setEmails] = React.useState<string[]>([]);
  const [repoIDs, setRepoIDs] = React.useState<string[]>([]);

  const doSubmit = React.useCallback(() => {
    submit(prev => ({
      ...prev,
      timeRange,
      emails,
      repoIDs,
    }))
  }, [submit, timeRange, emails, repoIDs])

  React.useEffect(doSubmit, [])

  const hasChanges = React.useMemo(() => {
    return !_.isEqual(timeRange, contextInfo.timeRange) || !_.isEqual(emails, contextInfo.emails)  || !_.isEqual(repoIDs, contextInfo.repoIDs);
  }, [timeRange, emails, repoIDs, contextInfo]);

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
          <RepositorySelector
            value={repoIDs}
            onChange={setRepoIDs}
          />
        </Group>
        <Group sx={{ alignSelf: 'flex-end' }}>
          <Button disabled={!hasChanges} color="blue" size="sm" onClick={doSubmit}>Submit</Button>
        </Group>
      </Group>
  )
}