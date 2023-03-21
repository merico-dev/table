type PanelType = {
  id: string;
  [key: string]: any;
};
type PrevViewType = {
  panels: PanelType[];
  [key: string]: any;
};
type NextViewType = {
  panelIDs: string[];
  [key: string]: any;
};

function getNewViewsAndPanels(prevViews: PrevViewType[]) {
  const views: NextViewType[] = [];
  const panels: PanelType[] = [];
  prevViews.forEach((v) => {
    const { panels, ...rest } = v;
    const panelIDs = panels.map((p) => p.id);

    views.push({
      ...rest,
      panelIDs,
    });

    panels.push(...panels);
  });

  return { views, panels };
}

/**
 * https://github.com/merico-dev/table/issues/789
 * @param schema
 * @returns new schema
 */
export function main({ views, ...rest }: Record<string, any>) {
  const result = getNewViewsAndPanels(views);
  return {
    ...rest,
    panels: result.panels,
    views: result.views,
    version: '8.38.0',
  };
}
