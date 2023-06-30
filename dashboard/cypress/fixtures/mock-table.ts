import { IViewPanelInfo } from '~/plugins';
import { ITableConf, ValueType } from '~/plugins/viz-components/table/type';

export const DEFAULT_TABLE_CONFIG = {
  id_field: 'queryID-01.foo',
  horizontalSpacing: '10px',
  verticalSpacing: '10px',
  use_raw_columns: false,
  columns: [
    {
      label: 'Foo',
      value_type: ValueType.string,
      value_field: 'queryID-01.foo',
    },
    { label: 'Bar', value_type: ValueType.string, value_field: 'queryID-01.bar' },
  ],
} as Partial<ITableConf>;
export const TABLE_PANEL: IViewPanelInfo = {
  layout: { h: 100, w: 100 },
  viz: {
    type: 'table',
    conf: {
      config: DEFAULT_TABLE_CONFIG,
    },
  },
  title: 'mock panel',
  description: 'mock panel desc',
  id: 'mock-panel-01',
  queryID: 'queryID-01',
};
export const MOCK_DATA = {
  'queryID-01': [
    { foo: 'alice', bar: 'bob' },
    {
      foo: 'carol',
      bar: 'dave',
    },
    { foo: 'eve', bar: 'frank' },
  ],
};
