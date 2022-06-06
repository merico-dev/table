import { Divider, Group } from "@mantine/core";
import React from "react";
import { DefinitionContext } from "../../contexts";
import { ContextInfo } from "./context-info";
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
    setDataSources!.setItem(index, value);
  }, [setDataSources, dataSources]);

  if (!dataSource) {
    return <span>Invalid Data Source ID</span>
  }
  return (
    <Group direction="row" position="apart" grow align="flex-start">
      <DataSourceForm value={dataSource} onChange={update}/>
      <Divider orientation="vertical"/>
      <ContextInfo />
    </Group>
  )
}