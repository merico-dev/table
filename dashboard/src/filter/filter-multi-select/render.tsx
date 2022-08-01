import { MultiSelect } from "@mantine/core";
import { useRequest } from "ahooks";
import React from "react";
import { queryByStaticSQL } from "../../api-caller";
import { IDashboardFilter, IFilterConfig_Select } from "../../types";

interface IFilterMultiSelect extends Omit<IDashboardFilter, 'type' | 'config'> {
  config: IFilterConfig_Select;
  value: any;
  onChange: (v: any) => void;
}

export function FilterMultiSelect({ label, config, value, onChange }: IFilterMultiSelect) {
  const usingRemoteOptions = !!config.options_query.sql;
  const { data: remoteOptions = [], loading } = useRequest(queryByStaticSQL(config.options_query), {
    refreshDeps: [config.options_query, usingRemoteOptions]
  })

  return (
    <MultiSelect
      label={label}
      data={usingRemoteOptions ? remoteOptions : config.static_options}
      disabled={usingRemoteOptions ? loading : false}
      value={value}
      onChange={onChange}
    />
  )
}