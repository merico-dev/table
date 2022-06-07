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
    const index = dataSources.findIndex(d => d.id === value.id);
    if (!index) {
      console.error(new Error('Invalid data source id when updating by id'))
      return;
    }
    setDataSources(prevs => {
      return prevs.map(p => {
        if (p.id === value.id) {
          return value;
        }
        return p;
      })
    });
  }, [setDataSources]);

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