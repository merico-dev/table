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
  viz: {
    type: 'table',
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

describe('viz-table.cy.ts', () => {
  let vizManager: IVizManager;
  beforeEach(() => {
    vizManager = new VizManager(pluginManager);
  });
  describe('viz view', () => {
    it('show data', () => {
      cy.mount(<VizViewComponent panel={mockPanel} data={mockData} vizManager={vizManager} />);
      cy.findByText('alice').should('exist');
    });
    it('update config', () => {
      const instance = vizManager.getOrCreateInstance(mockPanel);
      cy.mount(<VizViewComponent panel={mockPanel} data={mockData} vizManager={vizManager} />);
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
        setQueryID: cy.spy(),
        setTitle: cy.spy(),
      };
      cy.mount(
        <VizConfigComponent panel={mockPanel} data={mockData} vizManager={vizManager} panelInfoEditor={panelEditor} />,
      );
      cy.findByText('Table Config');
    });
    // FIXME: https://github.com/merico-dev/table/issues/353
    // it('update config', () => {
    //   const panelEditor: IPanelInfoEditor = {
    //     setDescription: cy.spy(),
    //     setQueryID: cy.spy(),
    //     setTitle: cy.spy(),
    //   };
    //   const instance = vizManager.getOrCreateInstance(mockPanel);
    //   cy.mount(
    //     <VizConfigComponent panel={mockPanel} data={mockData} vizManager={vizManager} panelInfoEditor={panelEditor} />,
    //   );
    //   cy.findByRole('searchbox', { name: /id field/i })
    //     .should('exist')
    //     .should('have.value', 'foo');
    //   cy.findByLabelText('Use Original Data Columns').click();
    //   cy.findByLabelText('save config').click();
    //   cy.then(async () => {
    //     const config = await instance.instanceData.getItem<ITableConf>('config');
    //     expect(get(config, 'use_raw_columns')).to.be.true;
    //   });
    // });
  });
});
