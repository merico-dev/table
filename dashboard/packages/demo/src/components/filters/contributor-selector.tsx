import { Loader, MultiSelect } from "@mantine/core";
import { useRequest } from "ahooks";
import React from "react";
import { post } from "../../api-caller/request";

async function getContributorOptions() {
  const sql = `
    SELECT a.email as value, a.email as label
    FROM public.account AS a
        INNER JOIN public.commit_metric AS cm
        ON a.email = cm.author_email
    WHERE a.name <> '' AND a.email <> ''
    GROUP BY (a.email)
  `;
  const res = await post('/query', { type: 'postgresql', key: 'vdev', sql })
  return res;
}

interface IContributorSelector {
  value: string[];
  onChange: React.Dispatch<React.SetStateAction<string[]>>;
}
export function ContributorSelector({
  value,
  onChange,
}: IContributorSelector) {

  const { data = [], loading } = useRequest(getContributorOptions, {
    refreshDeps: [],
  });
  return (
    <MultiSelect
      data={data}
      label="Contributors"
      placeholder="Select contributor emails"
      value={value}
      onChange={onChange}
      disabled={loading}
      sx={{ width: 320 }}
      rightSection={loading ? <Loader size="xs" /> : null}
      searchable
    />
  )
}