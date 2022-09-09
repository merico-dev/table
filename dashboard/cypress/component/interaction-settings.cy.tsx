import { InteractionSettings } from '~/interactions/components/interaction-settings';
import { InteractionManager } from '~/interactions/interaction-manager';
import { IVizManager, pluginManager, VizManager } from '~/plugins';
import { VizInstance } from '~/types/plugin';
import { TABLE_PANEL } from '../fixtures/mock-table';

describe('interaction-settings.cy.tsx', () => {
  let instance: VizInstance;
  let vizManager: IVizManager;
  let interactionManager: InteractionManager;
  beforeEach(() => {
    vizManager = new VizManager(pluginManager);
    instance = vizManager.getOrCreateInstance(TABLE_PANEL);
    interactionManager = new InteractionManager(instance, vizManager.resolveComponent(TABLE_PANEL.viz.type));
  });
  test('add new interaction', () => {
    // cy.mount()
    cy.mount(
      <InteractionSettings instance={instance} interactionManager={interactionManager} vizManager={vizManager} />,
    );
    cy.findByText(/add interaction/gi).click();
    cy.findByText(/click cell content/gi)
      .parents('button')
      .click();
    cy.findByLabelText(/choose a column/gi).click();
    cy.findByText('Foo').click();
    cy.findByLabelText(/close/gi).click();
    cy.findByText(/console.log/gi).click();
    cy.findByLabelText(/console.log/gi).type('cell value is' + ' ${cell_field_value}', {
      parseSpecialCharSequences: false,
    });
    cy.findByLabelText(/close/gi).click();
  });
});
