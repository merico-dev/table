import React from "react";
import { IDashboardDefinition, IDataSource, ISQLSnippet } from "../types";

export interface IDefinitionContext extends IDashboardDefinition {
  setSQLSnippets: React.Dispatch<React.SetStateAction<ISQLSnippet[]>>;
  setDataSources: React.Dispatch<React.SetStateAction<IDataSource[]>>;
}

const initialContext = {
  sqlSnippets: [],
  setSQLSnippets: () => {},
  dataSources: [],
  setDataSources: () => {},
}

export const DefinitionContext = React.createContext<IDefinitionContext>(initialContext);
