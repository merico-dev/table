import React from "react";

export type ContextInfoContextType = Record<string, any>;

const initialContext = {}

const ContextInfoContext = React.createContext<ContextInfoContextType>(initialContext);

export default ContextInfoContext;