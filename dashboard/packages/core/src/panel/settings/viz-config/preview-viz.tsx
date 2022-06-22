import React from "react";
import { PanelContext } from "../../../contexts";
import { ErrorBoundary } from "../../error-boundary";
import { Viz } from "../../viz";

interface IPreviewViz { }

export function PreviewViz({ }: IPreviewViz) {
  const { data, loading, viz } = React.useContext(PanelContext);
  return (
    <Viz viz={viz} data={data} loading={loading} />
  )
}