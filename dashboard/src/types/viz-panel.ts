import { IVizConfig } from './dashboard';

export interface IVizPanelProps {
  conf: IVizConfig['conf'];
  setConf: (conf: IVizConfig['conf']) => void;
  data: $TSFixMe[];
}
