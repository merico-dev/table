import React from "react";

export interface IDashboardActionContext {
  addPanel: () => void;
}

const initialContext = {
  addPanel: () => {},
}

export const DashboardActionContext = React.createContext<IDashboardActionContext>(initialContext);
