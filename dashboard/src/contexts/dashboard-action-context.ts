import _ from 'lodash';
import React from 'react';

export interface IDashboardActionContext {
  viewPanelInFullScreen: (id: string) => void;
  inFullScreen: boolean;
}

const initialContext = {
  viewPanelInFullScreen: _.noop,
  inFullScreen: false,
};

export const DashboardActionContext = React.createContext<IDashboardActionContext>(initialContext);
