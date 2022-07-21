import { Box, Breadcrumbs, Anchor, LoadingOverlay, Table, Container, Button, Group, Alert } from "@mantine/core";
import { useRequest } from "ahooks";
import { AlertCircle, PlaylistAdd, Trash } from "tabler-icons-react";
import { DatasourceAPI } from "../../api-caller/datasource";

const items = [
  { name: 'Settings', to: '/admin' },
  { name: 'Data Sources', to: '/admin/data_source/list' },
].map((item, index) => (
  <Anchor href={item.to} key={index}>
    {item.name}
  </Anchor>
));

export function DataSourcePage() {
  const { data = [], loading } = useRequest(async () => {
    const { data } = await DatasourceAPI.list()
    return data;
  }, {
    refreshDeps: [],
  });

  const remove = async (id: string) => {
    console.log('removing ', id)
  }

  return (
    <Box sx={{ maxWidth: 1200 }}>
      <Group position="apart" sx={{ width: '100%' }}>
        <Breadcrumbs>{items}</Breadcrumbs>
        <Button disabled leftIcon={<PlaylistAdd size={20} />}>Add a new data source</Button>
      </Group>
      <Alert mt="md" icon={<AlertCircle size={16} />} title="Editing data sources?" color="gray">
        Details of data sources are not exposed to avoid security risk.<br/>
        You may only <b>Add</b> or <b>Delete</b> a data source.
      </Alert>
      <Box mt="xl" sx={{ position: 'relative' }}>
        <LoadingOverlay visible={loading} />
        <Table horizontalSpacing="md" verticalSpacing="md" fontSize="md" highlightOnHover>
          <thead>
            <tr>
              <th>Type</th>
              <th>Key</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map(({ key, type }) => (
              <tr key={key}>
                <td width={200}>{type}</td>
                <td>{key}</td>
                <td width={200}>
                  <Button color="red" onClick={() => remove(key)} leftIcon={<Trash size={20} />}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Box>
    </Box>
  )
}