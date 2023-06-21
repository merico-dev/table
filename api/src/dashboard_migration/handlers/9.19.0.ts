function upgradePanels(panels: Record<string, any>[]) {
  return panels.map((p) => {
    const { queryID, queryIDs, ...rest } = p;
    return {
      ...rest,
      queryIDs: queryIDs ?? [queryID],
    };
  });
}

/**
 * https://github.com/merico-dev/table/issues/1015
 */
export function main({ panels, ...rest }: Record<string, any>) {
  const finalPanels = upgradePanels(panels);
  return {
    ...rest,
    panels: finalPanels,
    version: '9.19.0',
  };
}
