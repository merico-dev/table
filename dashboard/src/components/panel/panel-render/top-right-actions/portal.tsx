import { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { useChartControlsSlot } from '../chart-controls-context';

interface Props {
  children: ReactNode;
}

export function PanelTopRightActionsPortal({ children }: Props) {
  const chartControlsSlot = useChartControlsSlot();

  if (!chartControlsSlot) {
    return null;
  }

  return createPortal(children, chartControlsSlot);
}
