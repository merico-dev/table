import React, { useId } from 'react';

const PanelAddonContext = React.createContext<{ addonSlotId: string | null }>({ addonSlotId: null });

export function PanelAddonProvider({ children, addonSlotId }: { children: React.ReactNode; addonSlotId?: string }) {
  const generatedId = useId();
  const id = addonSlotId || `panel-addon-slot-${generatedId}`;
  return <PanelAddonContext.Provider value={{ addonSlotId: id }}>{children}</PanelAddonContext.Provider>;
}

export function usePanelAddonSlot() {
  const { addonSlotId } = React.useContext(PanelAddonContext);
  if (!addonSlotId) {
    return null;
  }
  return document.getElementById(addonSlotId);
}
