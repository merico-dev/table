import { VizTriggerManager } from '~/interactions/trigger';
import { IViewPanelInfo, pluginManager, VizManager } from '~/plugins';
import {
  ClickCellContent,
  ClickCellContentSettings,
  IClickCellContentConfig,
} from '~/plugins/viz-components/table/triggers/click-cell-content';
import { ITableConf, ValueType } from '~/plugins/viz-components/table/type';
import { VizInstance } from '~/types/plugin';

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

const fakeData = [
  { foo: 'alice', bar: 'bob' },
  {
    foo: 'carol',
    bar: 'dave',
  },
  { foo: 'eve', bar: 'frank' },
];

describe('click-cell-content-settings.cy.tsx', () => {
  let instance: VizInstance;
  let vizManager: VizManager;
  let triggerManager: VizTriggerManager;
  beforeEach(() => {
    vizManager = new VizManager(pluginManager);
    instance = vizManager.getOrCreateInstance(mockPanel);
    triggerManager = new VizTriggerManager(instance, vizManager.resolveComponent(mockPanel.viz.type));
  });
  test('column from config', () => {
    cy.then(async () => {
      const trigger = await triggerManager.createOrGetTrigger('builtin:table:click-cell-content', ClickCellContent);
      cy.mount(<ClickCellContentSettings instance={instance} sampleData={fakeData} trigger={trigger} />);
      cy.findByLabelText('Choose a column').click();
      cy.findByText('Foo')
        .click()
        .then(async () => {
          const data = await trigger.triggerData.getItem<IClickCellContentConfig>('config');
          expect(data.column).to.deep.equal(0);
        });
    });
  });
  test('column from original data', () => {
    cy.then(async () => {
      await instance.instanceData.setItem('config', {
        ...defaultConfig,
        columns: [],
        use_raw_columns: true,
      });
      const trigger = await triggerManager.createOrGetTrigger('builtin:table:click-cell-content', ClickCellContent);
      cy.mount(<ClickCellContentSettings instance={instance} sampleData={fakeData} trigger={trigger} />);
      cy.findByLabelText('Choose a column').click();
      cy.findByText('bar');
      cy.findByText('foo')
        .click()
        .then(async () => {
          const data = await trigger.triggerData.getItem<IClickCellContentConfig>('config');
          expect(data.column).to.deep.equal('foo');
        });
    });
  });
});
