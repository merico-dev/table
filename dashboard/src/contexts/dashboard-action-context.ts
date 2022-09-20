import _ from 'lodash';
import React from 'react';

export interface IDashboardActionContext {
  duplidatePanel: (id: string) => void;
  removePanelByID: (id: string) => void;
  viewPanelInFullScreen: (id: string) => void;
  inFullScreen: boolean;
}

const initialContext = {
  duplidatePanel: _.noop,
  removePanelByID: _.noop,
  viewPanelInFullScreen: _.noop,
  inFullScreen: false,
};

export const DashboardActionContext = React.createContext<IDashboardActionContext>(initialContext);
