import { set } from 'lodash';
import {
  IViewPanelInfo,
  IVizManager,
  VizConfigComponent,
  VizManager,
  VizViewComponent,
  pluginManager,
} from '~/components/plugins';
import { ITableConf, ValueType } from '~/components/plugins/viz-components/table/type';
import { PanelContextProvider } from '~/contexts';

const mockQueryID = 'queryID-01';
const defaultConfig = {
  query_id: mockQueryID,
  horizontalSpacing: '10px',
  verticalSpacing: '10px',
  use_raw_columns: false,
  columns: [
    {
      label: 'Foo',
      value_type: ValueType.string,
      value_field: `${mockQueryID}.foo`,
    },
  ],
} as Partial<ITableConf>;
const mockPanel: IViewPanelInfo = {
  layout: { h: 100, w: 100 },
  style: { border: { enabled: true } },
  viz: {
    type: 'table',
    conf: {
      config: defaultConfig,
    },
  },
  title: 'mock panel',
  description: 'mock panel desc',
  id: 'mock-panel-01',
  queryIDs: [mockQueryID],
  dataFieldOptions: () => [{ label: 'foo', value: `${mockQueryID}.foo` }],
  queryOptions: () => [{ label: 'mockQuery', value: mockQueryID }],
};
const mockData = { [mockQueryID]: [{ foo: 'alice', bar: 'bob' }] };
const MEASURE = {
  w: 800,
  h: 600,
};
describe('viz-table.cy.ts', () => {
  let vizManager: IVizManager;
  beforeEach(() => {
    vizManager = new VizManager(pluginManager);
  });
  describe('viz view', () => {
    it('show data', () => {
      cy.mount(
        <PanelContextProvider value={{ panel: mockPanel, data: mockData, loading: false, errors: [] }}>
          <VizViewComponent
            panel={mockPanel}
            measure={MEASURE}
            data={mockData}
            variables={[]}
            vizManager={vizManager}
          />
        </PanelContextProvider>,
      );
      cy.findByText('alice').should('exist');
    });
    it('update config', () => {
      const instance = vizManager.getOrCreateInstance(mockPanel);
      cy.mount(
        <PanelContextProvider value={{ panel: mockPanel, data: mockData, loading: false, errors: [] }}>
          <VizViewComponent
            panel={mockPanel}
            measure={MEASURE}
            data={mockData}
            variables={[]}
            vizManager={vizManager}
          />
        </PanelContextProvider>,
      );
      cy.findByText('alice')
        .should('exist')
        .then(() => {
          instance.instanceData.setItem(
            'config',
            set(defaultConfig, ['columns', 0, 'value_field'], `${mockQueryID}.bar`),
          );
        });
      cy.findByText('bob')
        .should('exist')
        .then(() => {
          instance.instanceData.setItem(
            'config',
            set(defaultConfig, ['columns', 0, 'value_field'], `${mockQueryID}.foo`),
          );
        });
      cy.findByText('alice').should('exist');
    });
  });
  describe('config panel', () => {
    it('render config panel', () => {
      cy.mount(
        <PanelContextProvider value={{ panel: mockPanel, data: mockData, loading: false, errors: [] }}>
          <VizConfigComponent panel={mockPanel} data={mockData} vizManager={vizManager} variables={[]} />
        </PanelContextProvider>,
      );
      cy.findByText('viz.viz_config_banner');
    });
    it('update config', () => {
      const instance = vizManager.getOrCreateInstance(mockPanel);
      cy.mount(
        <PanelContextProvider value={{ panel: mockPanel, data: mockData, loading: false, errors: [] }}>
          <VizConfigComponent panel={mockPanel} data={mockData} vizManager={vizManager} variables={[]} />
        </PanelContextProvider>,
      );
      cy.findByLabelText('viz.table.column.use_original_data_columns').click({ force: true });
      cy.get('button[type="submit"]', { timeout: 2000 }).should('be.enabled').click();
      cy.then(async () => {
        const { use_raw_columns } = await instance.instanceData.getItem<ITableConf>('config');
        expect(use_raw_columns).to.be.false;
      });
    });
  });
});
