import React from 'react';
import { IVizConfig } from '../types/dashboard';

export interface IPanelContext {
  id: string;
  data: any[];
  loading: boolean;
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  description: string;
  setDescription: React.Dispatch<React.SetStateAction<string>>;
  queryID: string;
  setQueryID: React.Dispatch<React.SetStateAction<string>>;
  viz: IVizConfig;
  setViz: React.Dispatch<React.SetStateAction<IVizConfig>>;
}

const initialContext = {
  id: '',
  data: [],
  loading: false,
  title: '',
  setTitle: () => {},
  description: '',
  setDescription: () => {},
  queryID: '',
  setQueryID: () => {},
  viz: {
    type: '',
    conf: {},
  },
  setViz: () => {},
};

export const PanelContext = React.createContext<IPanelContext>(initialContext);
