import { AnyObject, IDashboard } from '@devtable/dashboard/src/types';
import { Button, Modal } from '@mantine/core';
import { IconGitMerge } from '@tabler/icons';
import { useBoolean } from 'ahooks';
import React from 'react';
import { IDiffTarget } from './types';
import { Accessor, Matcher } from '@zeeko/power-accessor';
import { IJsonMergeEditorProps, IResolveResult, JsonMergeEditor } from './json-merge-editor';
import { useRebaseModel } from './rebase-config-context';
import { observer } from 'mobx-react-lite';
import { toJS } from 'mobx';

export const RebaseDashboardConfigModal = observer((props: { onApply: IJsonMergeEditorProps['onApply'] }) => {
  const rebaseConfigModel = useRebaseModel();
  const base = toJS(rebaseConfigModel.base);
  const local = toJS(rebaseConfigModel.local);
  const remote = toJS(rebaseConfigModel.remote);
  const [isModalOpen, modalOpen] = useBoolean(false);
  const canMergeChanges = remote && base && local;
  if (!canMergeChanges) {
    return null;
  }
  const handleApply = (changes: IResolveResult[]) => {
    props.onApply?.(changes);
    modalOpen.setFalse();
  };
  return (
    <>
      <Button onClick={modalOpen.setTrue} variant="filled" size="xs" leftIcon={<IconGitMerge size={20} />}>
        Merge Changes
      </Button>
      <Modal title="Merge Changes" style={{ top: 40 }} opened={isModalOpen} onClose={modalOpen.setFalse}>
        {isModalOpen && <MergeConfigModalContent onApply={handleApply} base={base} local={local} remote={remote} />}
      </Modal>
    </>
  );
});

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
  {
    selector: new Accessor<IDashboard, AnyObject>('definition', 'sqlSnippets', Matcher.all),
    idSelector: (it) => it.key,
    formatDisplayName: (it) => {
      return `Snippet: ${it.key}`;
    },
    produceOperation: (operationType, pointers, item) => {
      return (config: IDashboard) => {
        const snippets = config.definition?.sqlSnippets as AnyObject[];
        const index = snippets.findIndex((it) => it.key === item.key);
        if (operationType === 'added') {
          snippets.push(item);
        } else if (operationType === 'removed') {
          snippets.splice(index, 1);
        } else if (operationType === 'modified') {
          snippets[index] = item;
        }
      };
    },
  } as IDiffTarget<AnyObject, string>,
  {
    selector: new Accessor<IDashboard, AnyObject>('definition', 'queries', Matcher.all),
    idSelector: (it) => it.id,
    formatDisplayName: (it) => {
      return `Query: ${it.name}`;
    },
    produceOperation: (operationType, pointers, item) => {
      return (config: IDashboard) => {
        const queries = config.definition?.queries as AnyObject[];
        const index = queries.findIndex((it) => it.id === item.id);
        if (operationType === 'added') {
          queries.push(item);
        } else if (operationType === 'removed') {
          queries.splice(index, 1);
        } else if (operationType === 'modified') {
          queries[index] = item;
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
  return <JsonMergeEditor onApply={props.onApply} documents={props} diffNodes={diffNodes} />;
};
