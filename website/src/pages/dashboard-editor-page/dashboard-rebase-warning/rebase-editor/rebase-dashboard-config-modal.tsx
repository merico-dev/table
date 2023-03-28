import { Button, Modal } from '@mantine/core';
import { IconGitMerge } from '@tabler/icons';
import { useBoolean } from 'ahooks';
import React from 'react';
import { IJsonMergeEditorProps, JsonMergeEditor } from './json-merge-editor';
import { useRebaseModel } from './rebase-config-context';
import { observer } from 'mobx-react-lite';
import { toJS } from 'mobx';
import { IResolveResult, MergeJsonDocsState } from './merge-json-docs-state';

export const RebaseDashboardConfigModal = observer(
  (props: { onApply: IJsonMergeEditorProps['onApply']; state: MergeJsonDocsState }) => {
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
    const handleCancel = () => {
      modalOpen.setFalse();
    };
    return (
      <>
        <Button
          onClick={modalOpen.setTrue}
          variant="filled"
          size="xs"
          color="red"
          leftIcon={<IconGitMerge size={20} />}
        >
          Merge Changes
        </Button>
        <Modal
          title="Merge Changes"
          style={{ top: 40, zIndex: 1010 }}
          opened={isModalOpen}
          onClose={modalOpen.setFalse}
        >
          {isModalOpen && <JsonMergeEditor onApply={handleApply} state={props.state} onCancel={handleCancel} />}
        </Modal>
      </>
    );
  },
);
