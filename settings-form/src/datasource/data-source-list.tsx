import { Box, LoadingOverlay, Table, Group } from "@mantine/core";
import { useRequest } from "ahooks";
import React from "react";
import { APICaller } from "../api-caller";
import { APIClient } from "../api-caller/request";
import { AddDataSource } from "./add-data-source";
import { DeleteDataSource } from "./delete-data-source";
import { defaultStyles, IStyles } from "./styles";
import { ISettingsFormConfig } from "./types";

interface IDataSourceList {
  styles?: IStyles;
  config: ISettingsFormConfig;
}

export function DataSourceList({ styles = defaultStyles, config }: IDataSourceList) {
  const { data = [], loading, refresh } = useRequest(async () => {
    const { data } = await APICaller.datasource.list()
    return data;
  }, {
    refreshDeps: [],
  });

  if (APIClient.baseURL !== config.apiBaseURL) {
    APIClient.baseURL = config.apiBaseURL;
  }

  return (
    <>
      <Group pt={styles.spacing} position="right">
        <AddDataSource onSuccess={refresh} />
      </Group>
      <Box mt={styles.spacing} sx={{ position: 'relative' }}>
        <LoadingOverlay visible={loading} />
        <Table horizontalSpacing={styles.spacing} verticalSpacing={styles.spacing} fontSize={styles.size} highlightOnHover>
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
    </>
  )
}
