import { SinonStub } from 'cypress/types/sinon';
import { PluginVizConfigComponent } from '../../src/panel/plugin-adaptor';
import { IVizManager, VizManager } from '../../src/plugins';
import { PluginManager } from '../../src/plugins/plugin-manager';
import { createMockPlugin } from '../../src/plugins/test-utils';
import { IPluginManager } from '../../src/types/plugin';
import Agent = Cypress.Agent;

const mockPanel = {
  id: 'mock-panel-01',
  title: 'mock-panel-01',
  queryID: 'mock-panel-01',
  description: 'mock-panel-01',
  viz: {
    conf: {},
    type: 'mockComp',
  },
};
describe('PluginVizConfigComponent.cy.ts', () => {
  let pm: IPluginManager;
  let vm: IVizManager;
  let migrateHandler: Agent<SinonStub>;
  let needMigrateHandler: Agent<SinonStub>;
  let setVizConf: Agent<SinonStub>;
  beforeEach(() => {
    pm = new PluginManager();
    migrateHandler = cy.stub();
    needMigrateHandler = cy.stub();
    setVizConf = cy.stub();
    const mockPlugin = createMockPlugin('mock', ['mockComp'], {
      migrator: {
        needMigration: needMigrateHandler,
        migrate: migrateHandler,
      },
    });
    pm.install(mockPlugin);
    vm = new VizManager(pm);
    cy.mount(
      <PluginVizConfigComponent
        vizManager={vm}
        setVizConf={setVizConf}
        data={[]}
        panel={mockPanel}
        panelInfoEditor={{
          setTitle: cy.stub(),
          setDescription: cy.stub(),
          setQueryID: cy.stub(),
        }}
      />,
    );
  });

  it('migration', () => {
    needMigrateHandler.returns(Promise.resolve(true));
    cy.findByLabelText('update config').should('exist').click();
    cy.findByText(/hello/gi).then(() => {
      expect(migrateHandler).to.be.calledOnce;
    });
  });
  it('sync config', () => {
    needMigrateHandler.returns(Promise.resolve(false));
    cy.findByText(/hello/gi).then(async () => {
      const instance = vm.getOrCreateInstance(mockPanel);
      await instance.instanceData.setItem('foo', 'bar');
      expect(setVizConf).to.be.calledWith({
        conf: { foo: 'bar' },
        type: 'mockComp',
      });
    });
  });
});
