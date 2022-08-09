import { Stack, Tabs, Textarea } from '@mantine/core';
import React from 'react';
import { PreviewSQL } from '../../definition-editor/query-editor/preview-sql';
import { IFilterOptionQuery } from '../../model/filter/common';
import { SelectDataSource } from './select-data-source';

interface IFilterQueryField {
  value: IFilterOptionQuery;
  onChange: (v: IFilterOptionQuery) => void;
}
export const FilterQueryField = React.forwardRef(function _FilterQueryField(
  { value, onChange }: IFilterQueryField,
  _ref: any,
) {
  return (
    <Stack my={0}>
      <SelectDataSource value={value} onChange={onChange} />
      <Tabs defaultValue="SQL">
        <Tabs.List>
          <Tabs.Tab value="SQL">SQL</Tabs.Tab>
          <Tabs.Tab value="Preview">Preview</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="SQL" pt="sm">
          <Textarea
            autosize
            minRows={12}
            maxRows={24}
            className="code-textarea"
            value={value.sql}
            onChange={(e) => {
              onChange({ ...value, sql: e.currentTarget.value });
            }}
            placeholder="SELECT name AS label, id AS value"
          />
        </Tabs.Panel>
        <Tabs.Panel value="Preview" pt="sm">
          <PreviewSQL value={value.sql} />
        </Tabs.Panel>
      </Tabs>
    </Stack>
  );
});
