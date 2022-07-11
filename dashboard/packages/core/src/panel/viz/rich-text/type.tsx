import { IVizPanelProps } from "../../../types";

export interface IRichTextConf {
  content: ''
}

export interface IVizRichTextPanel extends Omit<IVizPanelProps, 'conf' | 'setConf'> {
  conf: IRichTextConf;
  setConf: (values: IRichTextConf) => void;
}