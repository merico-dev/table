import { Group, Text } from "@mantine/core";
import { Prism } from "@mantine/prism";
import React from "react";
import { PanelContext } from "../../../contexts/panel-context";

interface IQueryResult {
}

export function QueryResult({ }: IQueryResult) {
  const { data } = React.useContext(PanelContext)
  return (
    <div className="query-result-root">
      <Group mb="xs"><Text weight="bold">Data Length: </Text>{data.length}</Group>
      <Prism language="json" colorScheme="dark">
        {JSON.stringify(data, null, 2)}
      </Prism>
    </div>
  )
}