export type MericoPanelGroupItem = {
  name: string;
  comment: string;
  panelIDs: string[];
};

export type VizMericoPanelGroupsConf = {
  groups: MericoPanelGroupItem[];
};

export const getDefaultConfig = () => {
  const config: VizMericoPanelGroupsConf = {
    groups: [],
  };
  return config;
};
