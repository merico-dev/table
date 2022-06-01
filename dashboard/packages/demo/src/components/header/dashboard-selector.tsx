import { Select } from "@mantine/core";
import { useRequest } from "ahooks";
import React from "react";
import { DashboardAPI } from "../../api-caller/dashboard";

interface IDashboardSelector {
  id: string;
  setID: React.Dispatch<React.SetStateAction<string>>;
}

export function DashboardSelector({ id, setID }: IDashboardSelector) {
  const { data: options = [], loading, refresh } = useRequest(async () => {
    const { data } = await DashboardAPI.list();
    return data.map(d => ({
      label: d.name,
      value: d.id
    }))
  }, {
    refreshDeps: [],
  });

  React.useEffect(() => {
    if (!id && options.length > 0) {
      setID(options[0].value);
    }
  }, [id, setID, options])

  const handleChange = React.useCallback((selectedID: string | null) => {
    if (!selectedID) {
      return;
    }
    setID(selectedID)
  }, [setID]);

  return (
    <Select clearable={false} value={id} onChange={handleChange} data={options} />
  )
}