import { useUpdate } from 'ahooks';
import { noop } from 'lodash';
import { MutableRefObject, useEffect, useState } from 'react';
import { IValueStep } from '~/plugins/color-manager/multi-step-value-mapper';
import { RedGreen } from '~/plugins/colors';
import { ColorMappingEditor, IColorMappingEditorProps } from '~/plugins/controls/color-mapping-editor';

const steps: IValueStep[] = [
  { from: 0, to: 0 },
  { from: 200, to: 100 },
];
type TestBedHandle = { setSteps: IColorMappingEditorProps['onChange']; update: () => void };
const TestBed = (props: {
  onChange?: IColorMappingEditorProps['onChange'];
  handle: MutableRefObject<TestBedHandle>;
}) => {
  const [state, setState] = useState(steps);
  const update = useUpdate();
  useEffect(() => {
    props.handle.current.setSteps = (val) => {
      setState(val);
    };
    props.handle.current.update = update;
  }, []);

  const handleChange = (steps: IValueStep[]) => {
    setState(steps);
    props.onChange?.(steps);
  };
  return <ColorMappingEditor steps={state} interpolation={RedGreen} onChange={handleChange} />;
};

describe('color-mapping-editor.cy.ts', () => {
  test.todo('min max limit');
  let onChange: ReturnType<typeof cy.spy>;
  let handle: { current: TestBedHandle };
  beforeEach(() => {
    onChange = cy.spy().as('onChangeSpy');
    handle = { current: { setSteps: noop, update: noop } };
    cy.mount(<TestBed onChange={onChange} handle={handle} />);
  });
  test('controlled component', () => {
    // wait for the component to be mounted
    cy.wait(10);
    cy.then(() => {
      handle.current.setSteps?.([
        { from: 0, to: 0 },
        { from: 100, to: 100 },
      ]);
    });
    cy.get('.palette-value--bottom').first().should('have.text', '0');
    cy.get('.palette-value--bottom').last().should('have.text', '100');
  });
  test('change step', () => {
    cy.wait(10);
    // cy.then(() => {
    //   handle.current.update();
    // });
    cy.get('.palette-item').should('have.length', 13);
    // change the middle color
    cy.get('.palette-item').eq(6).click();
    cy.findByLabelText(/map a value/gi).type('200');
    cy.findByText(/ok/gi).click();
    cy.get('.palette-value--up').eq(6).should('have.text', '200');
    cy.get('@onChangeSpy').should('have.been.calledWith', [
      {
        from: 0,
        to: 0,
      },
      { from: 200, to: 50 },
      { from: 200, to: 100 },
    ]);
    // change the last color
    cy.get('.palette-item').last().click();
    cy.findByLabelText(/map a value/gi)
      .clear()
      .type('10000');
    cy.findByText(/ok/gi).click();
    cy.get('.palette-value--up').last().should('have.text', '10k');
    cy.get('@onChangeSpy').should('be.calledWith', [
      {
        from: 0,
        to: 0,
      },
      { from: 200, to: 50 },
      { from: 10000, to: 100 },
    ]);
    // cancel editing
    cy.get('.palette-item').eq(6).click();
    cy.findByLabelText(/map a value/gi)
      .clear()
      .clear()
      .type('100');
    cy.findByText(/cancel/gi).click();
    cy.get('.palette-value--up').eq(6).should('have.text', '200');
  });

  test('long value text', () => {
    cy.wait(10);
    cy.get('.palette-item').eq(2).click();
    cy.findByLabelText(/map a value/gi)
      .clear()
      .type('10000000000');
    cy.findByText(/ok/gi).click();
    cy.get('.palette-value--bottom').eq(2).invoke('outerWidth').should('be.eq', 36);
  });
});
