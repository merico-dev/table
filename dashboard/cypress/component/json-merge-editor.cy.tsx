import { JsonMergeEditor } from '~/definition-editor/json-merge-editor';
import { IDiffTarget } from '~/definition-editor/json-merge-editor/types';
import { Accessor, Matcher } from '@zeeko/power-accessor';

const documents = {
  base: {
    users: [
      {
        n: '1',
        id: '23555ec0-8aac-4d81-bb02-a2ba8d10e937',
        name: 'Teandre Pecoraro',
        address: 'Impacts St 3510, Rathenow, Mauritania, 744248',
        birthDate: '12.01.1992',
        email: 'tessia_mireles2b86@sponsored.rp',
      },
      {
        n: '2',
        id: '8766fcc0-050d-4d4a-b695-95b2180dc2e9',
        name: 'Carisa Hartigan',
        address: 'Hi St 2878, Lyndell, Guatemala, 572743',
        birthDate: '16.06.2022',
        email: 'cyler_kurtzse@resolve.cn',
      },
      {
        n: '3',
        id: '90ca82a1-546f-40e3-80fb-352bab0fa2bc',
        name: 'Halbert Bunnell',
        address: 'Emotional St 4605, Aguadulce, Switzerland, 453520',
        birthDate: '25.01.2019',
        email: 'hawley_dursthl@curves.smz',
      },
    ],
  },
  local: {
    users: [
      {
        n: '1',
        id: '23555ec0-8aac-4d81-bb02-a2ba8d10e937',
        name: 'Modified',
        address: 'Impacts St 3510, Rathenow, Mauritania, 744248',
        birthDate: '12.01.1992',
        email: 'tessia_mireles2b86@sponsored.rp',
      },
      {
        n: '3',
        id: 'aaca82a1-546f-40e3-80fb-352bab0fa2bc',
        name: 'Aalbert',
        address: 'Emotional St 4605, Aguadulce, Switzerland, 453520',
        birthDate: '25.01.2019',
        email: 'hawley_dursthl@curves.smz',
      },
    ],
  },
  remote: {
    users: [
      {
        n: '2',
        id: '8766fcc0-050d-4d4a-b695-95b2180dc2e9',
        name: 'Carisa Hartigan',
        address: 'Hi St 2878, Lyndell, Guatemala, 572743',
        birthDate: '16.06.2022',
        email: 'cyler_kurtzse@resolve.cn',
      },
      {
        n: '3',
        id: '90ca82a1-546f-40e3-80fb-352bab0fa2bc',
        name: 'Halbert Bunnell',
        address: 'Emotional St 4605, Aguadulce, Switzerland, 453520',
        birthDate: '25.01.2019',
        email: 'hawley_dursthl@curves.smz',
      },
    ],
  },
};

const nodes: IDiffTarget<object, object>[] = [
  {
    selector: new Accessor<object, object>('users', Matcher.all),
    idSelector: (it) => it.id,
    formatDisplayName: (it) => `User: ${it.name}`,
  },
];
describe('json-merge-editor.cy.ts', () => {
  function mount() {
    cy.viewport(900, 600);
    cy.mount(<JsonMergeEditor documents={documents} diffNodes={nodes} />);
  }

  it('playground', () => {
    mount();
  });
});
