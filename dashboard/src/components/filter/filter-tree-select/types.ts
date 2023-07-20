export interface ITreeDataQueryOption {
  label: string;
  value: string;
  parent_value: string;
  description?: string;
}

export interface ITreeDataRenderItem {
  label: string | JSX.Element;
  value: string;
  parent_value: string;
  description?: string;
  filterBasis: string;
}
