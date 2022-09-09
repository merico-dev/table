import { TriggerSelect } from '~/interactions/components/trigger-select';
import { VizTriggerManager } from '~/interactions/trigger';
import { IVizManager, pluginManager, VizManager } from '~/plugins';
import { ClickCellContent } from '~/plugins/viz-components/table/triggers';
import { IClickCellContentConfig } from '~/plugins/viz-components/table/triggers/click-cell-content';
import { VizInstance } from '~/types/plugin';
import { TABLE_PANEL } from '@cy/fixtures/mock-table';

describe('trigger-select.cy.tsx', () => {
  let instance: VizInstance;
  let vizManager: IVizManager;
  let triggerManager: VizTriggerManager;
  beforeEach(() => {
    vizManager = new VizManager(pluginManager);
    instance = vizManager.getOrCreateInstance(TABLE_PANEL);
    triggerManager = new VizTriggerManager(instance, vizManager.resolveComponent(TABLE_PANEL.viz.type));
  });
  it('playground', () => {
    cy.then(async () => {
      const t1 = await triggerManager.createOrGetTrigger('t1', ClickCellContent);
      await t1.triggerData.setItem<IClickCellContentConfig>('config', { column: 'Foo' });
      cy.mount(<TriggerSelect triggerId={t1.id} triggerManager={triggerManager} instance={instance} />);
      cy.findByText(/click cell of foo/gi);
    });
  });
});
