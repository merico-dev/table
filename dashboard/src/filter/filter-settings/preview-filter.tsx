import React from "react";
import { IDashboardFilter } from "../../types"
import { Filter } from "../filter";
import { Box, Stack, Text } from "@mantine/core";

interface IPreviewFilter {
  filter: IDashboardFilter;
}
export function PreviewFilter({ filter }: IPreviewFilter) {
  const [value, setValue] = React.useState(filter.default_value)
  return (
    <Box sx={{ maxWidth: '30em' }}>
      <Text pb="md" color="gray">Preview</Text>
      <Filter filter={filter} value={value} onChange={setValue} />
    </Box>
  )
}