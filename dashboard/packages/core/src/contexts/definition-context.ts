import { UseListStateHandlers } from "@mantine/hooks";
import React from "react";
import { IDashboardDefinition, IDataSource, ISQLSnippet } from "../types";

export interface IDefinitionContext extends IDashboardDefinition {
  setSQLSnippets: React.Dispatch<React.SetStateAction<ISQLSnippet[]>>;
  setDataSources?: UseListStateHandlers<IDataSource>;
}

const initialContext = {
  sqlSnippets: [],
  setSQLSnippets: () => {},
  dataSources: [],
}

export const DefinitionContext = React.createContext<IDefinitionContext>(initialContext);
