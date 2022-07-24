import React from "react";
import { IDashboardDefinition, IQuery, ISQLSnippet } from "../types";

export interface IDefinitionContext extends IDashboardDefinition {
  setSQLSnippets: React.Dispatch<React.SetStateAction<ISQLSnippet[]>>;
  setQueries: React.Dispatch<React.SetStateAction<IQuery[]>>;
}

const initialContext = {
  sqlSnippets: [],
  setSQLSnippets: () => {},
  queries: [],
  setQueries: () => {},
}

export const DefinitionContext = React.createContext<IDefinitionContext>(initialContext);
