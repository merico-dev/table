import { TABLE_PANEL } from '@cy/fixtures/mock-table';
import { OperationSelect } from '~/interactions/components/operation-select';
import { OperationManager } from '~/interactions/operation/operation-manager-impl';
import { ConsoleLog } from '~/interactions/operation/operations/console-log';
import { IVizManager, pluginManager, VizManager } from '~/plugins';
import { IClickCellContentConfig } from '~/plugins/viz-components/table/triggers/click-cell-content';
import { IPayloadVariableSchema, IVizOperationManager, VizInstance } from '~/types/plugin';

const VARIABLES: IPayloadVariableSchema[] = [
  {
    name: 'cell_field_name',
    valueType: 'string',
    description: 'The field name of the cell',
  },
  {
    name: 'row_index',
    valueType: 'number',
    description: 'The row index of the cell',
  },
  {
    name: 'column_index',
    valueType: 'number',
    description: 'The column index of the cell',
  },
];
// FIXME: https://github.com/merico-dev/table/issues/1057
describe('operation-select.cy.tsx', () => {
  // let instance: VizInstance;
  // let vizManager: IVizManager;
  // let operationManager: IVizOperationManager;
  // beforeEach(() => {
  //   vizManager = new VizManager(pluginManager);
  //   instance = vizManager.getOrCreateInstance(TABLE_PANEL);
  //   operationManager = new OperationManager(instance);
  // });
  // describe('playground', () => {
  //   beforeEach(() => {
  //     cy.then(async () => {
  //       const op1 = await operationManager.createOrGetOperation('op1', ConsoleLog);
  //       await op1.operationData.setItem<IClickCellContentConfig>('config', { column: 0 });
  //       cy.mount(
  //         <OperationSelect
  //           operationId={op1.id}
  //           operationManager={operationManager}
  //           instance={instance}
  //           variables={VARIABLES}
  //         />,
  //       );
  //     });
  //   });
  //   test('change settings', () => {
  //     cy.findByText(/console.log/gi).click();
  //     cy.findByText(/operation settings/gi);
  //     cy.findByLabelText(/console.log/gi).type('hello');
  //     cy.findByLabelText(/close/gi).click();
  //     cy.findByText(/console.log/gi).click();
  //     cy.findByLabelText(/console.log/gi).should('have.value', 'hello');
  //   });
  //   test('variable list', () => {
  //     cy.findByText(/console.log/gi).click();
  //     cy.findByText(/operation settings/gi);
  //     cy.findByText(/cell_field_name/gi);
  //     cy.findByText(/row_index/gi);
  //     cy.findByText(/column_index/gi);
  //   });
  // });
});
