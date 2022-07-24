import { Group, Text } from "@mantine/core";
import { Prism } from "@mantine/prism";
import React from "react";
import { ContextInfoContext } from "../../contexts";
import { explainSQLSnippet } from "../../utils/sql";

interface IPreviewSnippet {
  value: string;
}

export function PreviewSnippet({ value}: IPreviewSnippet) {
  const context = React.useContext(ContextInfoContext)
  const explained = React.useMemo(() => {
    return explainSQLSnippet(value, context)
  }, [value, context])

  return (
    <Group direction="column" noWrap grow>
      <Text>Preview</Text>
      <Prism language="sql" noCopy colorScheme="dark">{explained}</Prism>
    </Group>
  )
}
