function upgradeVariables(vars: any[], queryIDs: string[]) {
  if (queryIDs.length === 0) {
    return vars;
  }
  const queryID = queryIDs[0];

  return vars.map((v) => ({
    ...v,
    data_field: `${queryID}.${v.data_field}`,
  }));
}

function upgradePanels(panels: Record<string, any>[]) {
  return panels.map((p) => {
    const { queryID, queryIDs, variables = [], ...rest } = p;
    const finalQueryIDs = queryIDs ?? [queryID];
    return {
      ...rest,
      queryIDs: finalQueryIDs,
      variables: upgradeVariables(variables, finalQueryIDs),
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
