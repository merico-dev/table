import { Group } from "@mantine/core";
import React from "react";
import { DefinitionContext } from "../../contexts";
import { IQuery } from "../../types";
import { QueryForm } from "./form";

interface IQueryEditor {
  id: string;
  setID: React.Dispatch<React.SetStateAction<string>>;
}
export function QueryEditor({ id, setID }: IQueryEditor) {
  const { queries, setQueries } = React.useContext(DefinitionContext);

  const query = React.useMemo(() => {
    return queries.find(d => d.id === id);
  }, [queries, id]);

  const update = React.useCallback((value: IQuery) => {
    const index = queries.findIndex(d => d.id ===  id);
    if (index === -1) {
      console.error(new Error('Invalid data source id when updating by id'))
      return;
    }
    setQueries(prevs => {
      const index = prevs.findIndex(p => p.id === id) // match by original ID, not edited ID
      prevs.splice(index, 1, value)
      return [...prevs];
    });
    setID(value.id);

  }, [id, queries, setQueries, setID]);

  if (!id) {
    return null;
  }
  if (!query) {
    return <span>Invalid Data Source ID</span>
  }
  return (
    <QueryForm value={query} onChange={update}/>
  )
}