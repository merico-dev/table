import { mockViewport, mockResizeObserver } from 'jsdom-testing-mocks';
import { act } from '@testing-library/react';
import { set } from 'lodash';
import { render, screen, userEvent } from '../../../test/test-utils';
import { IPanelInfoEditor } from '../../../types/plugin';
import { pluginManager } from '../../plugin-context';
import { IVizManager, VizConfigComponent, VizManager, VizViewComponent } from '../../viz-manager';
import { IViewPanelInfo } from '../../viz-manager/components';
import { ITableConf, ValueType } from './type';

const defaultConfig = {
  use_raw_columns: false,
  columns: [
    {
      label: 'Foo',
      value_type: ValueType.string,
      value_field: 'foo',
    },
  ],
} as Partial<ITableConf>;
const mockPanel: IViewPanelInfo = {
  layout: { h: 100, w: 100 },
  viz: {
    type: 'dashboard/table',
    conf: {
      config: defaultConfig,
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
    mockViewport({ width: '600px', height: '400px' });
    mockResizeObserver();
    vizManager = new VizManager(pluginManager);
  });
  describe('viz view', () => {
    test('show data', async () => {
      render(<VizViewComponent panel={mockPanel} data={mockData} vizManager={vizManager} />);
      expect(await screen.findByText('alice')).toBeInTheDocument();
    });
    test('update config', async () => {
      const instance = vizManager.getOrCreateInstance(mockPanel);
      render(<VizViewComponent panel={mockPanel} data={mockData} vizManager={vizManager} />);
      await screen.findByText('alice');
      await act(async () => {
        await instance.instanceData.setItem('config', set(defaultConfig, ['columns', 0, 'value_field'], 'bar'));
      });
      await screen.findByText('bob');
      await act(async () => {
        await instance.instanceData.setItem('config', set(defaultConfig, ['columns', 0, 'value_field'], 'foo'));
      });
      await screen.findByText('alice');
    });
  });
  describe('config panel', () => {
    test('render config panel', async () => {
      const panelEditor: IPanelInfoEditor = {
        setDescription: vi.fn(),
        setQueryID: vi.fn(),
        setTitle: vi.fn(),
      };
      render(
        <VizConfigComponent panel={mockPanel} data={mockData} vizManager={vizManager} panelInfoEditor={panelEditor} />,
      );
      await screen.findByText('Table Config');
    });
    test('update config', async () => {
      const panelEditor: IPanelInfoEditor = {
        setDescription: vi.fn(),
        setQueryID: vi.fn(),
        setTitle: vi.fn(),
      };
      render(
        <VizConfigComponent panel={mockPanel} data={mockData} vizManager={vizManager} panelInfoEditor={panelEditor} />,
      );
      const labelInput = await screen.findByLabelText('col-label-0');
      await userEvent.type(labelInput, 'UpdatedFoo');
    });
  });
});
