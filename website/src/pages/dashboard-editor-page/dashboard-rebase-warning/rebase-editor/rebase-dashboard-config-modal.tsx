import { Button, Modal } from '@mantine/core';
import { IconGitMerge } from '@tabler/icons';
import { useBoolean } from 'ahooks';
import { toJS } from 'mobx';
import { observer } from 'mobx-react-lite';
import { JsonMergeEditor } from './json-merge-editor';
import { IResolveResult, MergeJsonDocsState } from './merge-json-docs-state';
import { IMergerModalTitle, MergerModalTitle } from './merger-modal-title';
import { useRebaseModel } from './rebase-config-context';

interface IRebaseDashboardConfigModal {
  onApply: IMergerModalTitle['onApply'];
  state: MergeJsonDocsState;
}

export const RebaseDashboardConfigModal = observer((props: IRebaseDashboardConfigModal) => {
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
      <Button onClick={modalOpen.setTrue} variant="filled" size="xs" color="red" leftIcon={<IconGitMerge size={20} />}>
        Merge Changes
      </Button>
      <Modal
        title={<MergerModalTitle onApply={handleApply} state={props.state} onCancel={handleCancel} />}
        opened={isModalOpen}
        closeOnEscape={false}
        closeOnClickOutside={false}
        withCloseButton={false}
        onClose={handleCancel}
        size="96vw"
        overflow="inside"
        zIndex={410}
        styles={{
          root: {
            top: 40,
          },
          title: {
            flexGrow: 1,
          },
        }}
      >
        {isModalOpen && <JsonMergeEditor state={props.state} />}
      </Modal>
    </>
  );
});
