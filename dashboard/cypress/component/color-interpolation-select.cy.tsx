import { useUpdate } from 'ahooks';
import { noop } from 'lodash';
import React, { ComponentProps, ComponentType, useEffect } from 'react';
import { ColorManager, pluginManager } from '~/plugins';
import { RedGreen } from '~/plugins/colors';
import {
  ColorInterpolationSelect,
  IColorInterpolationSelectProps,
} from '~/plugins/controls/color-interpolation-select';
import { AnyObject } from '~/types';

const withTestBed = <TP extends AnyObject = AnyObject, TC extends React.ComponentType<TP> = React.ComponentType<TP>>(
  Component: ComponentType<TP>,
) => {
  const props = {} as ComponentProps<TC>;
  const handle = {
    props: props,
    mounted: false,
    update: noop,
  };
  const Comp = () => {
    const updateFn = useUpdate();
    useEffect(() => {
      handle.update = updateFn;
      handle.mounted = true;
    }, []);

    return React.createElement(Component, handle.props);
  };
  return {
    handle,
    Comp,
  } as ITestBed<ComponentProps<TC>>;
};

interface ITestBed<TP> {
  handle: { props: TP; mounted: boolean; update: () => void };
  Comp: ComponentType;
}

describe('color-interpolation-select.cy.tsx', () => {
  const resizeObserverLoopErrRe = /^[^(ResizeObserver loop limit exceeded)]/;
  Cypress.on('uncaught:exception', (err) => {
    /* returning false here prevents Cypress from failing the test */
    if (resizeObserverLoopErrRe.test(err.message)) {
      return false;
    }
  });

  let testbed: ITestBed<IColorInterpolationSelectProps>;
  let colorManager: ColorManager;
  let onChangeSpy: ReturnType<typeof cy.spy>;
  beforeEach(() => {
    cy.viewport(800, 600);
    onChangeSpy = cy.spy().as('onChangeSpy');
    colorManager = new ColorManager(pluginManager);
    testbed = withTestBed(ColorInterpolationSelect);
    const { handle, Comp } = testbed;
    handle.props = {
      colorManager,
      value: {
        interpolation: colorManager.encodeColor(RedGreen),
        steps: [
          { from: 0, to: 0 },
          { from: 200, to: 100 },
        ],
      },
      onChange: onChangeSpy,
    };
    cy.mount(<Comp />);
    cy.waitUntil(() => handle.mounted);
  });
  test('cancel editing', () => {
    // click button to open modal
    cy.findByText(/red \/ green/gi).click();
    cy.findByTestId('color-interpolation-modal').as('modal');
    // change color style
    cy.findByLabelText(/color style/gi)
      .as('select')
      .click();
    cy.findByText(/yellow \/ blue/gi).click();
    cy.findByTestId('color-interpolation-modal').as('modal');
    cy.get('@modal')
      .findByText(/cancel/gi)
      .click();
    cy.get('@onChangeSpy').should('not.be.called');
    cy.findByText(/red \/ green/gi).click();
  });
  test('playground', () => {
    // click button to open modal
    cy.findByText(/red \/ green/gi).click();
    cy.findByTestId('color-interpolation-modal').as('modal');
    cy.findByText(/setup color interpolation/gi).should('exist');

    // change color style
    cy.findByLabelText(/color style/gi)
      .as('select')
      .click();
    cy.findByText(/yellow \/ blue/gi).click();
    cy.findByDisplayValue(/yellow \/ blue/gi).should('exist');

    // config color steps
    cy.findByTestId(/palette-item-6/)
      .findByTestId('palette-item-target')
      .click();
    cy.findByLabelText(/map a value/gi).type('40');
    cy.findByTestId(/palette-item-ok/gi).click();

    // commit changes
    cy.get('@modal').findByText(/ok/gi).click();
    cy.get('@modal').should('not.exist');
    cy.get('@onChangeSpy').should(
      'have.been.calledWith',
      Cypress.sinon.match.has('steps', Cypress.sinon.match.has('length', 3)),
    );
  });
});
