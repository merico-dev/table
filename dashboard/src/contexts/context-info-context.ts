import React from "react";

export type TimeRange = [Date | null, Date | null];

export type ContextInfoContextType = {
  timeRange: TimeRange;
  emails: string[];
  repoIDs: string[];
};

const initialContext = {
  timeRange: [null, null] as TimeRange,
  emails: [] as string[],
  repoIDs: [] as string[],
}

export const initialContextInfoContext = initialContext;

export const ContextInfoContext = React.createContext<ContextInfoContextType>(initialContext);
