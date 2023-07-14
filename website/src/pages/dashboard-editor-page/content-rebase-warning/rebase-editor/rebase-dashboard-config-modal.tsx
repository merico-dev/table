import { Button, Modal } from '@mantine/core';
import { IconGitMerge } from '@tabler/icons-react';
import { useBoolean } from 'ahooks';
import { observer } from 'mobx-react-lite';
import { JsonMergeEditor } from './json-merge-editor';
import { IResolveResult, MergeJsonDocsState } from './merge-json-docs-state';
import { IMergerModalTitle, MergerModalTitle } from './merger-modal-title';

interface IRebaseDashboardConfigModal {
  onApply: IMergerModalTitle['onApply'];
  state: MergeJsonDocsState;
}

export const RebaseDashboardConfigModal = observer((props: IRebaseDashboardConfigModal) => {
  const [isModalOpen, modalOpen] = useBoolean(false);
  const handleApply = (changes: IResolveResult[]) => {
    props.onApply?.(changes);
    modalOpen.setFalse();
  };
  const handleCancel = () => {
    modalOpen.setFalse();
  };
  return (
    <>
      <Button onClick={modalOpen.setTrue} variant="filled" size="xs" color="red" leftIcon={<IconGitMerge size={20} />}>
        Merge Changes
      </Button>
      <Modal
        title={<MergerModalTitle onApply={handleApply} state={props.state} />}
        opened={isModalOpen}
        closeOnEscape={false}
        closeOnClickOutside={false}
        withCloseButton={false}
        onClose={handleCancel}
        fullScreen
        zIndex={410}
        styles={{
          header: {
            marginRight: 0,
          },
          title: {
            flexGrow: 1,
            marginRight: 0,
          },
        }}
      >
        {isModalOpen && <JsonMergeEditor state={props.state} />}
      </Modal>
    </>
  );
});
