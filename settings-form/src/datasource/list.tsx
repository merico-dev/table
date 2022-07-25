import { Box, LoadingOverlay, Table, Group } from "@mantine/core";
import { useRequest } from "ahooks";
import React from "react";
import { APICaller } from "../api-caller";
import { AddDataSource } from "./add-data-source";
import { DeleteDataSource } from "./delete-data-source";

export function DataSourceList() {
  const { data = [], loading, refresh } = useRequest(async () => {
    const { data } = await APICaller.datasource.list()
    return data;
  }, {
    refreshDeps: [],
  });
  return (
    <Box mt="xl" sx={{ position: 'relative' }}>
      <LoadingOverlay visible={loading} />
      <AddDataSource onSuccess={refresh} />
      <Table horizontalSpacing="md" verticalSpacing="md" fontSize="md" highlightOnHover>
        <thead>
          <tr>
            <th>Type</th>
            <th>Name</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map(({ id, key, type }) => (
            <tr key={key}>
              <td width={200}>{type}</td>
              <td>{key}</td>
              <td width={200}>
                <Group position="left">
                  <DeleteDataSource id={id} name={key} onSuccess={refresh} />
                </Group>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Box>
  )
}
