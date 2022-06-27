import { Group,  Select } from "@mantine/core";
import _ from "lodash";
import React from "react";

interface IDataFieldSelector {
  label: string;
  required?: boolean;
  value: string;
  onChange: (v: string) => void;
  data: any[];
}

function _DataFieldSelector({ label, required, value, onChange, data }: IDataFieldSelector, ref: any) {
  const options = React.useMemo(() => {
    if (!Array.isArray(data) || data.length === 0) {
      return [];
    }

    const keys = Object.keys(data[0]);
    return keys.map(k => ({
      label: k,
      value: k,
    }))
  }, [data]);

  return (
    <Group direction="column" grow noWrap ref={ref}>
      <Group direction="row" grow>
        <Select
          label={label}
          data={options}
          value={value}
          onChange={onChange}
          required={required}
        />
      </Group>
    </Group>
  )
}

export const DataFieldSelector = React.forwardRef(_DataFieldSelector)
