import { SunburstItemType } from '../type';

export type TreeItemIn = {
  id: string;
  parent_id: string | null;
} & SunburstItemType;

export type TreeItemOut = TreeItemIn & {
  children: TreeItemOut[];
};

export interface IEchartsSunburstLabelFormatter {
  treePathInfo: {
    name: string;
    dataIndex: number;
    value: number;
  }[];
  name: string;
  value: number;
  marker: string;
  color: string;
}
