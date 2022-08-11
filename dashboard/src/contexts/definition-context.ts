import React from 'react';
import { QueryModelInstance } from '../model/queries';
import { IDashboardDefinition, ISQLSnippet } from '../types';

export interface IDefinitionContext extends IDashboardDefinition {
  setSQLSnippets: React.Dispatch<React.SetStateAction<ISQLSnippet[]>>;
  setQueries: React.Dispatch<React.SetStateAction<QueryModelInstance[]>>;
}

const initialContext = {
  sqlSnippets: [],
  setSQLSnippets: () => {},
  queries: [],
  setQueries: () => {},
};

export const DefinitionContext = React.createContext<IDefinitionContext>(initialContext);
