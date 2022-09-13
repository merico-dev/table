import { useEffect, useState } from 'react';
import { ITriggerSnapshot, IVizTriggerManager } from '~/types/plugin';

export const useTriggerSnapshotList = <TConfig>(triggerManager: IVizTriggerManager, triggerSchemaId: string) => {
  const [state, setState] = useState<ITriggerSnapshot<TConfig>[]>([]);
  useEffect(() => {
    return triggerManager.watchTriggerSnapshotList((list) =>
      setState(list.filter((it) => it.schemaRef === triggerSchemaId) as unknown as ITriggerSnapshot<TConfig>[]),
    );
  }, []);

  return state;
};
