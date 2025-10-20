import React from 'react';

const ChartControlsContext = React.createContext<{ chartControlsSlotId: string | null }>({
  chartControlsSlotId: null,
});

export function ChartControlsProvider({
  children,
  chartControlsSlotId,
}: {
  children: React.ReactNode;
  chartControlsSlotId: string;
}) {
  return <ChartControlsContext.Provider value={{ chartControlsSlotId }}>{children}</ChartControlsContext.Provider>;
}

export function useChartControlsSlot() {
  const { chartControlsSlotId } = React.useContext(ChartControlsContext);
  if (!chartControlsSlotId) {
    return null;
  }
  return document.getElementById(chartControlsSlotId);
}
