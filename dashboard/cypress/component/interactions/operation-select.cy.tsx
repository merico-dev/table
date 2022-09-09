import { MOCK_DATA, TABLE_PANEL } from '@cy/fixtures/mock-table';
import { OperationSelect } from '~/interactions/components/operation-select';
import { OperationManager } from '~/interactions/operation/operation-manager-impl';
import { ConsoleLog } from '~/interactions/operation/operations/console-log';
import { IVizManager, pluginManager, VizManager } from '~/plugins';
import { IClickCellContentConfig } from '~/plugins/viz-components/table/triggers/click-cell-content';
import { IVizOperationManager, VizInstance } from '~/types/plugin';

describe('operation-select.cy.tsx', () => {
  let instance: VizInstance;
  let vizManager: IVizManager;
  let operationManager: IVizOperationManager;
  beforeEach(() => {
    vizManager = new VizManager(pluginManager);
    instance = vizManager.getOrCreateInstance(TABLE_PANEL);
    operationManager = new OperationManager(instance);
  });
  test('playground', () => {
    cy.then(async () => {
      const op1 = await operationManager.createOrGetOperation('op1', ConsoleLog);
      await op1.operationData.setItem<IClickCellContentConfig>('config', { column: 0 });
      cy.mount(
        <OperationSelect
          operationId={op1.id}
          operationManager={operationManager}
          instance={instance}
          sampleData={MOCK_DATA}
          variables={[]}
        />,
      );
      cy.findByText(/console.log/gi).click();
      cy.findByText(/operation settings/gi);
      cy.findByLabelText(/console.log/gi).type('hello');
      cy.findByLabelText(/close/gi).click();
      cy.findByText(/console.log/gi).click();
      cy.findByLabelText(/console.log/gi).should('have.value', 'hello');
    });
  });
});
