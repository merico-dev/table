import { Box, Button, Group, Textarea } from "@mantine/core";
import { Prism } from "@mantine/prism";
import React from "react";
import { PanelContext } from "../../../../contexts/panel-context";
import './index.css';

interface ISQLQueryEditor {
}
export function SQLQueryEditor({ }: ISQLQueryEditor) {
  const { dataSource, setDataSource } = React.useContext(PanelContext)
  const [showPreview, setShowPreview] = React.useState(true)

  const handleChange = (e: any) => {
    setDataSource({
      sql: e.target.value
    })
  }

  const togglePreview = React.useCallback(() => {
    setShowPreview(v => !v)
  }, [])

  const format = React.useCallback(() => {
    setDataSource(ds => ({
      sql: ds.sql.trim()
    }))
  }, [setDataSource]);

  return (
    <Box className="sql-query-editor-root" sx={{ height: '100%' }}>
      <Textarea
        value={dataSource.sql}
        onChange={handleChange}
        minRows={20}
        maxRows={20}
      />

      <Group m="md" position="right">
        <Button color="blue" onClick={format}>Format</Button>
        <Button variant="default" onClick={togglePreview}>Toggle Preview</Button>
      </Group>

      {showPreview && <Prism language="sql" withLineNumbers noCopy colorScheme="dark">{dataSource.sql}</Prism>}
    </Box>
  )
}