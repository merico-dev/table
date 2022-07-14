import _ from "lodash";
import React from "react";

export interface IDashboardActionContext {
  addPanel: () => void;
  duplidatePanel: (id: string) => void;
}

const initialContext = {
  addPanel: _.noop,
  duplidatePanel: _.noop,
}

export const DashboardActionContext = React.createContext<IDashboardActionContext>(initialContext);
