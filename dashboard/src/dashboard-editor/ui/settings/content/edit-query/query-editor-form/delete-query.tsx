import { Button, Tooltip } from '@mantine/core';
import { useModals } from '@mantine/modals';
import { IconTrash } from '@tabler/icons-react';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { useEditContentModelContext, useEditDashboardContext } from '~/contexts';
import { QueryRenderModelInstance } from '~/model';

export interface IDeleteQueryProps {
  queryModel: QueryRenderModelInstance;
}

const _DeleteQuery = (props: IDeleteQueryProps) => {
  const { t } = useTranslation();
  const { queryModel } = props;
  const model = useEditDashboardContext();
  const content = useEditContentModelContext();
  const usage = content.findQueryUsage(queryModel.id);
  const disabled = usage.length > 0;

  const modals = useModals();
  const remove = () => {
    modals.openConfirmModal({
      title: 'Delete this query?',
      labels: { confirm: t('common.actions.confirm'), cancel: t('common.actions.cancel') },
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
