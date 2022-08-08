import React from 'react';

export type FilterValuesContextType = Record<string, any>;

const initialContext = {};

export const initialFilterValuesContext = initialContext;

export const FilterValuesContext = React.createContext<FilterValuesContextType>(initialContext);
