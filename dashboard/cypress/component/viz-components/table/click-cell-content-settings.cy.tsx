import { VizTriggerManager } from '~/interactions/trigger';
import { pluginManager, VizManager } from '~/components/plugins';
import {
  ClickCellContent,
  ClickCellContentSettings,
  IClickCellContentConfig,
} from '~/components/plugins/viz-components/table/triggers/click-cell-content';
import { VizInstance } from '~/types/plugin';
import { DEFAULT_TABLE_CONFIG, MOCK_DATA, TABLE_PANEL } from '../../../fixtures/mock-table';

describe('click-cell-content-settings.cy.tsx', () => {
  let instance: VizInstance;
  let vizManager: VizManager;
  let triggerManager: VizTriggerManager;
  beforeEach(() => {
    vizManager = new VizManager(pluginManager);
    instance = vizManager.getOrCreateInstance(TABLE_PANEL);
    triggerManager = new VizTriggerManager(instance, vizManager.resolveComponent(TABLE_PANEL.viz.type));
  });
  test('column from config', () => {
    cy.then(async () => {
      const trigger = await triggerManager.createOrGetTrigger('builtin:table:click-cell-content', ClickCellContent);
      cy.mount(<ClickCellContentSettings instance={instance} sampleData={MOCK_DATA} trigger={trigger} />);
      cy.findByLabelText('viz.table.click_cell.choose_a_column').click();
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
        ...DEFAULT_TABLE_CONFIG,
        columns: [],
        use_raw_columns: true,
      });
      const trigger = await triggerManager.createOrGetTrigger('builtin:table:click-cell-content', ClickCellContent);
      cy.mount(<ClickCellContentSettings instance={instance} sampleData={MOCK_DATA} trigger={trigger} />);
      cy.findByLabelText('viz.table.click_cell.column_data_field')
        .type('foo')
        .then(async () => {
          const data = await trigger.triggerData.getItem<IClickCellContentConfig>('config');
          expect(data.column).to.deep.equal('foo');
        });
    });
  });

  test('read config', () => {
    cy.then(async () => {
      const trigger = await triggerManager.createOrGetTrigger('builtin:table:click-cell-content', ClickCellContent);
      await trigger.triggerData.setItem<IClickCellContentConfig>('config', { column: 0 });
      cy.mount(<ClickCellContentSettings instance={instance} sampleData={MOCK_DATA} trigger={trigger} />);
      cy.findByDisplayValue('Foo');
    });
  });
});
