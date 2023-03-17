import { AnyObject, IDashboard } from '@devtable/dashboard/src/types';
import { Button, Modal } from '@mantine/core';
import { IconGitMerge } from '@tabler/icons';
import { useBoolean } from 'ahooks';
import React, { PropsWithChildren } from 'react';
import { IDiffTarget } from './types';
import { Accessor, Matcher } from '@zeeko/power-accessor';
import { IJsonMergeEditorProps, JsonMergeEditor } from './json-merge-editor';
import { useDashboardStore } from '../../../frames/app/models/dashboard-store-context';

export interface IMergeDashboardConfigContextValue {
  remote?: IDashboard;
  local?: IDashboard;
  base?: IDashboard;
}

export const MergeDashboardConfigContext = React.createContext<IMergeDashboardConfigContextValue>(
  {} as IMergeDashboardConfigContextValue,
);

export const RebaseDashboardConfigProvider = (props: PropsWithChildren<IMergeDashboardConfigContextValue>) => {
  const parentContext = React.useContext(MergeDashboardConfigContext);
  return (
    <MergeDashboardConfigContext.Provider value={{ ...parentContext, ...props }}>
      {props.children}
    </MergeDashboardConfigContext.Provider>
  );
};

export const RebaseDashboardConfigModal = () => {
  const { remote, local, base } = React.useContext(MergeDashboardConfigContext);
  const [isModalOpen, modalOpen] = useBoolean(false);
  const canMergeChanges = remote && base && local;
  if (!canMergeChanges) {
    return null;
  }
  return (
    <>
      <Button onClick={modalOpen.setTrue} variant="filled" size="xs" leftIcon={<IconGitMerge size={20} />}>
        Merge Changes
      </Button>
      <Modal title="Merge Changes" style={{ top: 40 }} opened={isModalOpen} onClose={modalOpen.setFalse}>
        {isModalOpen && <MergeConfigModalContent base={base} local={local} remote={remote} />}
      </Modal>
    </>
  );
};

const diffNodes: IDiffTarget<AnyObject, string>[] = [
  {
    selector: new Accessor<IDashboard, AnyObject>('filters', Matcher.all),
    idSelector: (it) => it.id,
    formatDisplayName: (it) => {
      return `Filter: ${it.label}`;
    },
    produceOperation: (operationType, pointers, item) => {
      return (config: IDashboard) => {
        const filters = config.filters as AnyObject[];
        const index = filters.findIndex((it) => it.id === item.id);
        if (operationType === 'added') {
          filters.push(item);
        } else if (operationType === 'removed') {
          filters.splice(index, 1);
        } else if (operationType === 'modified') {
          filters[index] = item;
        }
      };
    },
  } as IDiffTarget<AnyObject, string>,
];

const MergeConfigModalContent = (props: {
  base: AnyObject;
  remote: AnyObject;
  local: AnyObject;
  onApply: IJsonMergeEditorProps['onApply'];
}) => {
  const { store } = useDashboardStore();
  return <JsonMergeEditor onApply={props.onApply} documents={props} diffNodes={diffNodes} />;
};
