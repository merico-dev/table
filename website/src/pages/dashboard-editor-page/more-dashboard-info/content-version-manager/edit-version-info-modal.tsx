import { DashboardContentDBType } from '@devtable/dashboard';
import { Badge, Group, Modal, Text } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { EditVersionInfo } from './edit-version-info';
import { useDashboardStore } from '../../../../frames/app/models/dashboard-store-context';

const modalStyles = {
  modal: { paddingLeft: '0px !important', paddingRight: '0px !important' },
  header: { marginBottom: 0, padding: '10px 20px 10px', borderBottom: '1px solid #efefef' },
  title: { flexGrow: 1 },
};

interface IEditVersionInfoModal {
  opened: boolean;
  close: () => void;
  dashboardName: string;
  content: DashboardContentDBType;
  postSubmit: () => void;
}

export const EditVersionInfoModal = observer(
  ({ opened, close, dashboardName, content, postSubmit }: IEditVersionInfoModal) => {
    const { store } = useDashboardStore();
    const closeAndUpdateVersionInfo = (name?: string) => {
      if (name) {
        store.currentDetail?.content.setName(name);
      }
      postSubmit();
      close();
    };
    return (
      <Modal
        opened={opened}
        onClose={close}
        closeOnEscape={false}
        title={
          <Group position="apart" pr={7} sx={{ flexGrow: 1 }}>
            <Text fw={500}>Edit Version</Text>
            <Badge variant="gradient" gradient={{ from: 'indigo', to: 'cyan' }}>
              Dashboard: {dashboardName}
            </Badge>
          </Group>
        }
        zIndex={320}
        size="450px"
        styles={modalStyles}
      >
        <EditVersionInfo postSubmit={closeAndUpdateVersionInfo} {...content} />
      </Modal>
    );
  },
);
