import _ from 'lodash';
import React from 'react';

export interface IDashboardActionContext {
  addPanel: () => void;
  duplidatePanel: (id: string) => void;
  removePanelByID: (id: string) => void;
  viewPanelInFullScreen: (id: string) => void;
  inFullScreen: boolean;
}

const initialContext = {
  addPanel: _.noop,
  duplidatePanel: _.noop,
  removePanelByID: _.noop,
  viewPanelInFullScreen: _.noop,
  inFullScreen: false,
};

export const DashboardActionContext = React.createContext<IDashboardActionContext>(initialContext);
