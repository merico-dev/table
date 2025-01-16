import React, { useId } from 'react';

const PanelAddonContext = React.createContext<{ addonSlotId: string | null }>({ addonSlotId: null });

export function PanelAddonProvider({ children }: { children: React.ReactNode }) {
  const id = `panel-addon-slot-${useId()}`;
  return (
    <PanelAddonContext.Provider value={{ addonSlotId: id }}>
      <div style={{ position: 'static', top: 0, left: 0 }} id={id}></div>
      {children}
    </PanelAddonContext.Provider>
  );
}

export function usePanelAddonSlot() {
  const { addonSlotId } = React.useContext(PanelAddonContext);
  if (!addonSlotId) {
    return null;
  }
  return document.getElementById(addonSlotId);
}
