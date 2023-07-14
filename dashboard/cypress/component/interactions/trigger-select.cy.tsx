import { ReadyTriggerConfigModel, TriggerConfigModel } from '~/interactions/components/trigger-config-model';
import { TriggerSelect } from '~/interactions/components/trigger-select';
import { VizTriggerManager } from '~/interactions/trigger';
import { IVizManager, pluginManager, VizManager } from '~/plugins';
import { ClickCellContent } from '~/plugins/viz-components/table/triggers';
import { IClickCellContentConfig } from '~/plugins/viz-components/table/triggers/click-cell-content';
import { VizInstance } from '~/types/plugin';
import { MOCK_DATA, TABLE_PANEL } from '@cy/fixtures/mock-table';

// FIXME: https://github.com/merico-dev/table/issues/1057
describe('trigger-select.cy.tsx', () => {
  // let instance: VizInstance;
  // let vizManager: IVizManager;
  // let triggerManager: VizTriggerManager;
  // beforeEach(() => {
  //   vizManager = new VizManager(pluginManager);
  //   instance = vizManager.getOrCreateInstance(TABLE_PANEL);
  //   triggerManager = new VizTriggerManager(instance, vizManager.resolveComponent(TABLE_PANEL.viz.type));
  // });
  // it('playground', () => {
  //   cy.then(async () => {
  //     const t1 = await triggerManager.createOrGetTrigger('t1', ClickCellContent);
  //     await t1.triggerData.setItem<IClickCellContentConfig>('config', { column: 0 });
  //     const triggerConfigModel = new TriggerConfigModel(triggerManager, instance);
  //     await triggerConfigModel.configTrigger(t1.id, MOCK_DATA);
  //     cy.mount(<TriggerSelect model={triggerConfigModel as ReadyTriggerConfigModel} />);
  //     cy.findByText(/click cell of foo/gi).click();
  //     cy.findByText(/setup trigger/gi);
  //     cy.findByLabelText(/choose a column/gi).click();
  //     cy.findByText(/bar/gi).click();
  //     cy.findByLabelText(/close setup/gi).click();
  //     cy.findByText(/click cell of bar/gi);
  //   });
  // });
});
