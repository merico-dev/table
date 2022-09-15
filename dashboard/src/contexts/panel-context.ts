import _ from 'lodash';
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
  setTitle: _.noop,
  description: '',
  setDescription: _.noop,
  queryID: '',
  setQueryID: _.noop,
  viz: {
    type: '',
    conf: {},
  },
  setViz: _.noop,
};

export const PanelContext = React.createContext<IPanelContext>(initialContext);
