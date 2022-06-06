import { Group } from "@mantine/core";
import React from "react";
import { DefinitionContext } from "../../contexts";
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
    <Group direction="column" mt="xs" spacing="xs" grow sx={{ border: '1px solid #eee' }}>
      <DataSourceForm value={dataSource} onChange={update}/>
    </Group>
  )
}