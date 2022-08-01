import { Select } from "@mantine/core";
import { useRequest } from "ahooks";
import React from "react";
import { queryByStaticSQL } from "../../api-caller";
import { IDashboardFilter, IFilterConfig_Select } from "../../types";

interface IFilterSelect extends Omit<IDashboardFilter, 'type' | 'config'> {
  config: IFilterConfig_Select;
  value: any;
  onChange: (v: any) => void;
}

export function FilterSelect({ label, config, value, onChange }: IFilterSelect) {
  const usingRemoteOptions = !!config.options_query.sql;
  const { data: remoteOptions = [], loading } = useRequest(queryByStaticSQL(config.options_query), {
    refreshDeps: [config.options_query, usingRemoteOptions]
  })

  if (usingRemoteOptions) {
    console.log({ loading, remoteOptions })
  }
  return (
    <Select
      label={label}
      data={usingRemoteOptions ? remoteOptions : config.static_options}
      disabled={usingRemoteOptions ? loading : false}
      value={value}
      onChange={onChange}
    />
  )
}