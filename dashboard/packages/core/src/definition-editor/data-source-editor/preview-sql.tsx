import { Prism } from "@mantine/prism";
import React from "react";
import { ContextInfoContext, DefinitionContext } from "../../contexts";
import { explainSQL } from "../../utils/sql";

interface IPreviewSQL {
  value: string;
}
export function PreviewSQL({ value }: IPreviewSQL) {
  const context = React.useContext(ContextInfoContext)
  const definition = React.useContext(DefinitionContext)

  const explained = React.useMemo(() => {
    return explainSQL(value, context, definition)
  }, [value, context, definition])
  return (
    <Prism language="sql" colorScheme="light">{explained}</Prism>
  )
}