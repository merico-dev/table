import { Button, Tooltip } from '@mantine/core';
import { useModals } from '@mantine/modals';
import { IconTrash } from '@tabler/icons';
import { observer } from 'mobx-react-lite';
import { useModelContext } from '~/contexts';
import { QueryModelInstance } from '~/model';

export interface IDeleteQueryProps {
  queryModel: QueryModelInstance;
}

const _DeleteQuery = (props: IDeleteQueryProps) => {
  const { queryModel } = props;
  const dashboardModel = useModelContext();
  const dependingPanels = dashboardModel.findDependingPanels(queryModel.id);
  const disabled = dependingPanels.length > 0;

  const modals = useModals();
  const remove = () => {
    modals.openConfirmModal({
      title: 'Delete this query?',
      labels: { confirm: 'Confirm', cancel: 'Cancel' },
      onCancel: () => console.log('Cancel'),
      onConfirm: () => dashboardModel.queries.removeQuery(queryModel.id),
      zIndex: 320,
    });
  };

  const button = (
    <Button
      color="red"
      size="xs"
      disabled={disabled}
      onClick={remove}
      leftIcon={<IconTrash size={16} />}
      sx={{ alignSelf: 'flex-end' }}
    >
      Delete this Query
    </Button>
  );
  if (disabled) {
    return (
      <Tooltip
        label={`This query is used in the following panels: ${dependingPanels.join(', ')}`}
        withArrow
        events={{ hover: true, focus: false, touch: false }}
        withinPortal
      >
        {button}
      </Tooltip>
    );
  }
  return button;
};

export const DeleteQuery = observer(_DeleteQuery);
