import { ActionIcon, Button, Menu, Tooltip } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { QueryModelInstance } from '~/dashboard-editor/model';
import { MericoIconCopy, MericoIconDelete, MericoIconMore } from './merico-icons';
import { useEditContentModelContext, useEditDashboardContext } from '~/contexts';
import { useModals } from '@mantine/modals';
import { useTranslation } from 'react-i18next';

type Props = {
  queryModel: QueryModelInstance;
};

const DeleteQuery = observer(({ queryModel }: Props) => {
  const { t } = useTranslation();
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
        label="此查询在使用中，不能删除。请查看“使用情况”标签页以了解详情"
        withArrow
        events={{ hover: true, focus: false, touch: false }}
        withinPortal
        zIndex={320}
        position="bottom-end"
      >
        <Button
          leftSection={<MericoIconDelete width={14} height={14} color="gray" />}
          variant="subtle"
          color="gray"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          删除查询
        </Button>
      </Tooltip>
    );
  }
  return (
    <Menu.Item leftSection={<MericoIconDelete width={14} height={14} />} color="red" onClick={remove}>
      删除查询
    </Menu.Item>
  );
});

export const MoreActions = observer(({ queryModel }: Props) => {
  return (
    <Menu shadow="md" width={120} trigger="hover">
      <Menu.Target>
        <ActionIcon variant="subtle" aria-label="Settings">
          <MericoIconMore width={18} height={18} />
        </ActionIcon>
      </Menu.Target>

      <Menu.Dropdown>
        {/* <Menu.Item leftSection={<MericoIconCopy width={14} height={14} />}>复制API</Menu.Item> */}
        <DeleteQuery queryModel={queryModel} />
      </Menu.Dropdown>
    </Menu>
  );
});
