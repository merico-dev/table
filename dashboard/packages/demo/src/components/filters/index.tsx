import { Button, Group } from "@mantine/core";
import { DateRangePicker } from "@mantine/dates";
import _ from "lodash";
import React from "react";
import { ContextInfoContextType, TimeRangeType } from "@devtable/dashboard";
import { ContributorSelector } from "./contributor-selector";
import { RepositorySelector } from "./repository-selector";
import { JenkinsJobSelector } from "./jenkins-job-selector";

interface IFilters {
  context: ContextInfoContextType;
  submit: React.Dispatch<React.SetStateAction<ContextInfoContextType>>;
}

export function Filters({ context, submit }: IFilters) {
  const [timeRange, setTimeRange] = React.useState<TimeRangeType>([
    new Date(2021, 1, 1),
    new Date(),
  ]);

  const [emails, setEmails] = React.useState<string[]>([]);
  const [repoIDs, setRepoIDs] = React.useState<string[]>([]);
  const [jenkinsJobIDs, setJenkinsJobIDs] = React.useState<string[]>([]);

  const doSubmit = React.useCallback(() => {
    submit(prev => ({
      ...prev,
      timeRange,
      emails,
      repoIDs,
      jenkinsJobIDs,
    }))
  }, [submit, timeRange, emails, repoIDs, jenkinsJobIDs])

  React.useEffect(doSubmit, [])

  const hasChanges = React.useMemo(() => {
    return !_.isEqual(timeRange, context.timeRange) || !_.isEqual(emails, context.emails)  || !_.isEqual(repoIDs, context.repoIDs) || !_.isEqual(jenkinsJobIDs, context.jenkinsJobIDs);
  }, [timeRange, emails, repoIDs, jenkinsJobIDs, context]);

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
          <JenkinsJobSelector
            value={jenkinsJobIDs}
            onChange={setJenkinsJobIDs}
          />
        </Group>
        <Group sx={{ alignSelf: 'flex-end' }}>
          <Button disabled={!hasChanges} color="blue" size="sm" onClick={doSubmit}>Submit</Button>
        </Group>
      </Group>
  )
}