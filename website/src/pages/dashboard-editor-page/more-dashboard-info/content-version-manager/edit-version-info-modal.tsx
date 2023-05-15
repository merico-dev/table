import { Badge, Box, Group, Modal, Text } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { useDashboardStore } from '../../../../frames/app/models/dashboard-store-context';
import { EditVersionInfo } from './edit-version-info';
import { DashboardContentDBType } from '@devtable/dashboard';

const modalStyles = {
  modal: { paddingLeft: '0px !important', paddingRight: '0px !important' },
  header: { marginBottom: 0, padding: '0 20px 10px', borderBottom: '1px solid #efefef' },
  title: { flexGrow: 1 },
  body: {
    padding: '0 0 0 20px',
  },
};

interface IEditVersionInfoModal {
  opened: boolean;
  close: () => void;
  dashboardName: string;
  content: DashboardContentDBType;
}

export const EditVersionInfoModal = observer(({ opened, close, dashboardName, content }: IEditVersionInfoModal) => {
  return (
    <Modal
      opened={opened}
      onClose={close}
      closeOnEscape={false}
      title={
        <Group position="apart" sx={{ flexGrow: 1 }}>
          <Text fw={500}>Edit Version</Text>
          <Group spacing={7}>
            <Badge variant="gradient" gradient={{ from: 'indigo', to: 'cyan' }}>
              Dashboard: {dashboardName}
            </Badge>
          </Group>
        </Group>
      }
      zIndex={320}
      size="800px"
      overflow="inside"
      styles={modalStyles}
    >
      <Box sx={{ height: '600px' }}>
        <EditVersionInfo {...content} />
      </Box>
    </Modal>
  );
});
