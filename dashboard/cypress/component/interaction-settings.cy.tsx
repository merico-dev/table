import { InteractionSettings } from '~/interactions/components/interaction-settings';
import { InteractionManager } from '~/interactions';
import { IVizManager, pluginManager, VizManager } from '~/plugins';
import { VizInstance } from '~/types/plugin';
import { MOCK_DATA, TABLE_PANEL } from '../fixtures/mock-table';

describe('interaction-settings.cy.tsx', () => {
  let instance: VizInstance;
  let vizManager: IVizManager;
  let interactionManager: InteractionManager;
  beforeEach(() => {
    vizManager = new VizManager(pluginManager);
    instance = vizManager.getOrCreateInstance(TABLE_PANEL);
    interactionManager = new InteractionManager(instance, vizManager.resolveComponent(TABLE_PANEL.viz.type));
  });

  function addInteraction() {
    cy.findByText(/add interaction/gi).click();
    cy.findByText(/click cell content/gi)
      .parents('button')
      .click();
    cy.findByLabelText(/choose a column/gi).click();
    cy.findByText('Foo').click();
    cy.findByLabelText(/close/gi).click();
    cy.findByText(/console.log/gi).click();
    cy.findByLabelText(/console.log/gi).type('cell value is ${cell_field_value}', {
      parseSpecialCharSequences: false,
    });
    cy.findByLabelText(/close/gi).click();
  }

  test('add new interaction', () => {
    mount();
    addInteraction();
  });

  function mount() {
    cy.mount(
      <InteractionSettings
        sampleData={MOCK_DATA}
        variables={[]}
        instance={instance}
        interactionManager={interactionManager}
        vizManager={vizManager}
      />,
    );
  }

  test('delete interaction', () => {
    mount();
    addInteraction();
    const triggerBtn = cy.findByText(/click cell/gi);
    cy.findByLabelText(/delete/gi).click();
    triggerBtn.should('not.exist');
  });
});
