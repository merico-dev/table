import { Stack, Tabs, Textarea } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { PreviewSQL } from '../../definition-editor/query-editor/preview-sql';
import { DashboardModelInstance } from '../../model';
import { IFilterOptionQuery } from '../../model/filters/filter/common';
import { SelectDataSource } from './select-data-source';
import { TestQuery } from './test-query';

interface IFilterQueryField {
  value: IFilterOptionQuery;
  onChange: (v: IFilterOptionQuery) => void;
}
export const FilterQueryField = observer(function _FilterQueryField({ value, onChange }: IFilterQueryField) {
  return (
    <Stack my={0}>
      <SelectDataSource value={value} onChange={onChange} />
      <Tabs defaultValue="SQL">
        <Tabs.List>
          <Tabs.Tab value="SQL">SQL</Tabs.Tab>
          <Tabs.Tab value="Preview">Preview</Tabs.Tab>
          <Tabs.Tab value="Data">Data</Tabs.Tab>
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
        <Tabs.Panel value="Data" pt="sm">
          <TestQuery query={value} />
        </Tabs.Panel>
      </Tabs>
    </Stack>
  );
});
