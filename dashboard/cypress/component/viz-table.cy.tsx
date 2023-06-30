import { get, set } from 'lodash';
import {
  IViewPanelInfo,
  IVizManager,
  pluginManager,
  VizConfigComponent,
  VizManager,
  VizViewComponent,
} from '../../src/plugins';
import { ITableConf, ValueType } from '../../src/plugins/viz-components/table/type';
import { IPanelInfoEditor } from '../../src/types/plugin';

const defaultConfig = {
  id_field: 'foo',
  horizontalSpacing: '10px',
  verticalSpacing: '10px',
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
  queryIDs: ['queryID-01'],
};
const mockData = { 'queryID-01': [{ foo: 'alice', bar: 'bob' }] };

describe('viz-table.cy.ts', () => {
  let vizManager: IVizManager;
  beforeEach(() => {
    vizManager = new VizManager(pluginManager);
  });
  describe('viz view', () => {
    it('show data', () => {
      cy.mount(<VizViewComponent panel={mockPanel} data={mockData} variables={[]} vizManager={vizManager} />);
      cy.findByText('alice').should('exist');
    });
    it('update config', () => {
      const instance = vizManager.getOrCreateInstance(mockPanel);
      cy.mount(<VizViewComponent panel={mockPanel} data={mockData} variables={[]} vizManager={vizManager} />);
      cy.findByText('alice')
        .should('exist')
        .then(() => {
          instance.instanceData.setItem('config', set(defaultConfig, ['columns', 0, 'value_field'], 'bar'));
        });
      cy.findByText('bob')
        .should('exist')
        .then(() => {
          instance.instanceData.setItem('config', set(defaultConfig, ['columns', 0, 'value_field'], 'foo'));
        });
      cy.findByText('alice').should('exist');
    });
  });
  describe('config panel', () => {
    it('render config panel', () => {
      const panelEditor: IPanelInfoEditor = {
        setDescription: cy.spy(),
        addQueryID: cy.spy(),
        removeQueryID: cy.spy(),
        setTitle: cy.spy(),
      };
      cy.mount(
        <VizConfigComponent
          panel={mockPanel}
          data={mockData}
          vizManager={vizManager}
          variables={[]}
          panelInfoEditor={panelEditor}
        />,
      );
      cy.findByText('Table Config');
    });
    it('update config', () => {
      const panelEditor: IPanelInfoEditor = {
        setDescription: cy.spy(),
        addQueryID: cy.spy(),
        removeQueryID: cy.spy(),
        setTitle: cy.spy(),
      };
      const instance = vizManager.getOrCreateInstance(mockPanel);
      cy.mount(
        <VizConfigComponent
          panel={mockPanel}
          data={mockData}
          vizManager={vizManager}
          variables={[]}
          panelInfoEditor={panelEditor}
        />,
      );
      cy.findByLabelText('Use Original Data Columns').click({ force: true });
      cy.get('button[type="submit"]', { timeout: 2000 }).should('be.enabled').click();
      cy.then(async () => {
        const { use_raw_columns } = await instance.instanceData.getItem<ITableConf>('config');
        expect(use_raw_columns).to.be.false;
      });
    });
  });
});
