import React from 'react';

export type TimeRangeType = [Date | null, Date | null];

export type ContextInfoContextType = Record<string, TimeRangeType | any | any[]>;

const initialContext = {};

export const initialContextInfoContext = initialContext;

export const ContextInfoContext = React.createContext<ContextInfoContextType>(initialContext);
