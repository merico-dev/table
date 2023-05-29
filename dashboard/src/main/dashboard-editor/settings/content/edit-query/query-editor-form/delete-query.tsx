import { Button, Tooltip } from '@mantine/core';
import { useModals } from '@mantine/modals';
import { IconTrash } from '@tabler/icons';
import { observer } from 'mobx-react-lite';
import { useContentModelContext, useModelContext } from '~/contexts';
import { QueryModelInstance } from '~/model';

export interface IDeleteQueryProps {
  queryModel: QueryModelInstance;
}

const _DeleteQuery = (props: IDeleteQueryProps) => {
  const { queryModel } = props;
  const model = useModelContext();
  const content = useContentModelContext();
  const usage = content.findQueryUsage(queryModel.id);
  const disabled = usage.length > 0;

  const modals = useModals();
  const remove = () => {
    modals.openConfirmModal({
      title: 'Delete this query?',
      labels: { confirm: 'Confirm', cancel: 'Cancel' },
      onCancel: () => console.log('Cancel'),
      onConfirm: () => {
        content.queries.removeQuery(queryModel.id);
        model.editor.setPath(['_QUERIES_', '']);
      },
      confirmProps: { color: 'red' },
      zIndex: 320,
    });
  };

  if (disabled) {
    return (
      <Tooltip
        label="Can't delete this query for it's being used, check out Usage tab for details"
        withArrow
        events={{ hover: true, focus: false, touch: false }}
        withinPortal
      >
        <Button color="gray" size="xs" leftIcon={<IconTrash size={16} />} sx={{ alignSelf: 'flex-end' }}>
          Delete this Query
        </Button>
      </Tooltip>
    );
  }
  return (
    <Button color="red" size="xs" onClick={remove} leftIcon={<IconTrash size={16} />} sx={{ alignSelf: 'flex-end' }}>
      Delete this Query
    </Button>
  );
};

export const DeleteQuery = observer(_DeleteQuery);
