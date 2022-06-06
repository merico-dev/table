import React from "react";
import { IDataSource, IVizConfig } from "../types/dashboard";

export interface IPanelContext {
  data: any[];
  loading: boolean;
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  description: string;
  setDescription: React.Dispatch<React.SetStateAction<string>>;
  dataSource: IDataSource;
  setDataSource: (statePartial: Partial<IDataSource> | ((currentState: IDataSource) => Partial<IDataSource>)) => void;
  viz: IVizConfig;
  setViz: React.Dispatch<React.SetStateAction<IVizConfig>>;
  refreshData: () => void;
}

const initialContext = {
  data: [],
  loading: false,
  title: '',
  setTitle: () => { },
  description: '',
  setDescription: () => { },
  dataSource: {
    type: 'postgresql',
    key: '',
    sql: '',
  } as const,
  setDataSource: () => { },
  viz: {
    type: '',
    conf: {},
  },
  setViz: () => { },
  refreshData: () => { },
}

export const PanelContext = React.createContext<IPanelContext>(initialContext);
