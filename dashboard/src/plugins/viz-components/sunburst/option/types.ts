import { SunburstItemType } from '../type';

export type TreeItemIn = {
  id: string;
  parent_id: string | null;
} & SunburstItemType;

export type TreeItemOut = TreeItemIn & {
  children: TreeItemOut[];
};
