import React from "react";

export type TimeRange = [Date | null, Date | null];

export type ContextInfoContextType = {
  timeRange: TimeRange;
  emails: string[];
};

const initialContext = {
  timeRange: [null, null] as TimeRange,
  emails: [] as string[],
}

const ContextInfoContext = React.createContext<ContextInfoContextType>(initialContext);

export default ContextInfoContext;