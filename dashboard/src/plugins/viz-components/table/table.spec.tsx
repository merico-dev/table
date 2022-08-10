import { render, screen } from '../../../test/test-utils';
import { pluginManager } from '../../plugin-context';
import { IVizManager, VizManager, VizViewComponent } from '../../viz-manager';
import { IViewPanelInfo } from '../../viz-manager/components';
import { ITableConf, ValueType } from './type';

const mockPanel: IViewPanelInfo = {
  layout: { h: 100, w: 100 },
  viz: {
    type: 'dashboard/table',
    conf: {
      config: {
        use_raw_columns: false,
        columns: [
          {
            label: 'Foo',
            value_type: ValueType.string,
            value_field: 'foo',
          },
        ],
      } as Partial<ITableConf>,
    },
  },
  title: 'mock panel',
  description: 'mock panel desc',
  id: 'mock-panel-01',
  queryID: 'queryID-01',
};
const mockData = [{ foo: 'alice', bar: 'bob' }];

describe('table', () => {
  let vizManager: IVizManager;
  beforeEach(() => {
    vizManager = new VizManager(pluginManager);
  });
  describe('viz view', () => {
    test('show data', async () => {
      render(<VizViewComponent panel={mockPanel} data={mockData} vizManager={vizManager} />);
      expect(await screen.findByText('alice')).toBeInTheDocument();
    });
    test.todo('update config');
  });
  describe('config panel', () => {
    test.todo('render config panel');
    test.todo('update config');
    test.todo('display preview');
  });
});
