import { Box, Button, Tooltip } from '@mantine/core';
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
      title: `${t('query.delete')}?`,
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
        label={t('query.cant_delete')}
        withArrow
        events={{ hover: true, focus: false, touch: false }}
        withinPortal
        zIndex={320}
        position="top-end"
      >
        <Box sx={{ alignSelf: 'flex-end' }}>
          <Button disabled size="xs" leftIcon={<IconTrash size={16} />}>
            {t('query.delete')}
          </Button>
        </Box>
      </Tooltip>
    );
  }
  return (
    <Button color="red" size="xs" onClick={remove} leftIcon={<IconTrash size={16} />} sx={{ alignSelf: 'flex-end' }}>
      {t('query.delete')}
    </Button>
  );
};

export const DeleteQuery = observer(_DeleteQuery);
