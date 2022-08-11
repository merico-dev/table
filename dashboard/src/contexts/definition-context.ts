import React from 'react';
import { IDashboardDefinition, ISQLSnippet } from '../types';

export interface IDefinitionContext extends Omit<IDashboardDefinition, 'queries'> {
  setSQLSnippets: React.Dispatch<React.SetStateAction<ISQLSnippet[]>>;
}

const initialContext = {
  sqlSnippets: [],
  setSQLSnippets: () => {},
};

export const DefinitionContext = React.createContext<IDefinitionContext>(initialContext);
