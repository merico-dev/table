import { Group } from "@mantine/core";
import React from "react";
import { DefinitionContext } from "../../contexts";
import { ContextAndSnippets } from "./context-and-snippets";
import { IDataSource } from "../../types";
import { DataSourceForm } from "./form";

interface IDataSourceEditor {
  id: string;
}
export function DataSourceEditor({ id }: IDataSourceEditor) {
  const { dataSources, setDataSources } = React.useContext(DefinitionContext);

  const dataSource = React.useMemo(() => {
    return dataSources.find(d => d.id === id);
  }, [dataSources, id]);

  const update = React.useCallback((value: IDataSource) => {
    const index = dataSources.findIndex(d => d.id ===  id);
    if (index === -1) {
      console.error(new Error('Invalid data source id when updating by id'))
      return;
    }
    setDataSources(prevs => {
      const index = prevs.findIndex(p => p.id === id) // match by original ID, not edited ID
      prevs.splice(index, 1, value)
      return [...prevs];
    });
  }, [id, dataSources, setDataSources]);

  if (!id) {
    return null;
  }
  if (!dataSource) {
    return <span>Invalid Data Source ID</span>
  }
  return (
    <Group direction="row" position="apart" grow align="stretch" noWrap>
      <DataSourceForm value={dataSource} onChange={update}/>
      <ContextAndSnippets />
    </Group>
  )
}