import { Loader, MultiSelect } from "@mantine/core";
import { useRequest } from "ahooks";
import React from "react";
import { post } from "../../api-caller/request";

async function getRepoOptions() {
  const sql = `
    SELECT r.name AS label, r.id AS value
    FROM public.repository AS r
        INNER JOIN public.commit_metric AS cm
        ON r.id = cm.repo_id
    WHERE r.name <> ''
    GROUP BY (r.id)
  `;
  const res = await post('/query', { sql })
  return res;
}

interface IRepositorySelector {
  value: string[];
  onChange: React.Dispatch<React.SetStateAction<string[]>>;
}
export function RepositorySelector({
  value,
  onChange,
}: IRepositorySelector) {

  const { data = [], loading } = useRequest(getRepoOptions, {
    refreshDeps: [],
  });
  return (
    <MultiSelect
      data={data}
      label="Repositories"
      placeholder="Select repositories"
      value={value}
      onChange={onChange}
      disabled={loading}
      sx={{ width: 320 }}
      rightSection={loading ? <Loader size="xs" /> : null}
      searchable
    />
  )
}