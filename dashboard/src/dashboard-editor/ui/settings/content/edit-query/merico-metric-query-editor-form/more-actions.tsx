import { ActionIcon, Menu } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { QueryModelInstance } from '~/dashboard-editor/model';
import { MericoIconCopy, MericoIconDelete, MericoIconMore } from './merico-icons';

type Props = {
  queryModel: QueryModelInstance;
};
export const MoreActions = observer(({ queryModel }: Props) => {
  return (
    <Menu shadow="md" width={120} trigger="hover">
      <Menu.Target>
        <ActionIcon variant="subtle" aria-label="Settings">
          <MericoIconMore width={18} height={18} />
        </ActionIcon>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item leftSection={<MericoIconCopy width={14} height={14} />}>复制API</Menu.Item>
        <Menu.Item leftSection={<MericoIconDelete width={14} height={14} />} color="red">
          删除查询
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
});
