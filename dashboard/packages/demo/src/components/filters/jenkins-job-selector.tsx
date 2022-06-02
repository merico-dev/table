import { Loader, MultiSelect } from "@mantine/core";
import { useRequest } from "ahooks";
import React from "react";
import { post } from "../../api-caller/request";

async function getOptions() {
  const sql = `
    SELECT j.name AS label, j.id AS value
    FROM builds AS b
        INNER JOIN jobs AS j
        ON b.job_id = j.id
    GROUP BY (j.id)
  `;
  const res = await post('/query', { sql })
  return res;
}

interface IJenkinsJobSelector {
  value: string[];
  onChange: React.Dispatch<React.SetStateAction<string[]>>;
}
export function JenkinsJobSelector({
  value,
  onChange,
}: IJenkinsJobSelector) {

  const { data = [], loading } = useRequest(getOptions, {
    refreshDeps: [],
  });
  return (
    <MultiSelect
      data={data}
      label="Jenkins Jobs"
      placeholder="Select jobs"
      value={value}
      onChange={onChange}
      disabled={loading}
      sx={{ width: 320 }}
      rightSection={loading ? <Loader size="xs" /> : null}
      searchable
    />
  )
}