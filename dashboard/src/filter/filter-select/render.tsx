import { Select } from '@mantine/core';
import { useRequest } from 'ahooks';
import React from 'react';
import { queryByStaticSQL } from '../../api-caller';
import { FilterModelInstance } from '../../model';
import { IFilterConfig_Select } from '../../model/filter/select';

interface IFilterSelect extends Omit<FilterModelInstance, 'type' | 'config'> {
  config: IFilterConfig_Select;
  value: any;
  onChange: (v: any) => void;
}

export function FilterSelect({ label, config, value, onChange }: IFilterSelect) {
  const usingRemoteOptions = !!config.options_query.sql;
  const { data: remoteOptions = [], loading } = useRequest(queryByStaticSQL(config.options_query), {
    refreshDeps: [config.options_query, usingRemoteOptions],
  });

  return (
    <Select
      label={label}
      data={usingRemoteOptions ? remoteOptions : config.static_options}
      disabled={usingRemoteOptions ? loading : false}
      value={value}
      onChange={onChange}
    />
  );
}
