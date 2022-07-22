import { Box, Breadcrumbs, Anchor, LoadingOverlay, Table, Container, Button, Group, Alert } from "@mantine/core";
import { useRequest } from "ahooks";
import React from "react";
import { AlertCircle, PlaylistAdd, Trash } from "tabler-icons-react";
import { DatasourceAPI } from "../../api-caller/datasource";
import { AddDataSource } from "./add-data-source";
import { DeleteDataSource } from "./delete-data-source";

const items = [
  { name: 'Settings', to: '/admin' },
  { name: 'Data Sources', to: '/admin/data_source/list' },
].map((item, index) => (
  <Anchor href={item.to} key={index}>
    {item.name}
  </Anchor>
));

export function DataSourcePage() {
  const { data = [], loading, refresh } = useRequest(async () => {
    const { data } = await DatasourceAPI.list()
    return data;
  }, {
    refreshDeps: [],
  });

  return (
    <Box sx={{ maxWidth: 1200 }}>
      <Group position="apart" sx={{ width: '100%' }}>
        <Breadcrumbs>{items}</Breadcrumbs>
        <AddDataSource onSuccess={refresh} />
      </Group>
      <Alert mt="md" icon={<AlertCircle size={16} />} title="Editing data sources?" color="gray">
        Details of data sources are not exposed to avoid security risk.<br />
        You may only <b>Add</b> or <b>Delete</b> a data source.
      </Alert>
      <Box mt="xl" sx={{ position: 'relative' }}>
        <LoadingOverlay visible={loading} />
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
                <td width={300}>
                  <Group position="left">
                    <Button disabled>Test</Button>
                    <DeleteDataSource id={id} name={key} onSuccess={refresh} />
                  </Group>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Box>
    </Box>
  )
}