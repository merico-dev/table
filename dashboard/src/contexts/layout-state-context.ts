import _ from 'lodash';
import React from 'react';

export interface ILayoutStateContext {
  inEditMode: boolean;
}

const initialContext = {
  inEditMode: false,
};

export const LayoutStateContext = React.createContext<ILayoutStateContext>(initialContext);
