import { useBoolean } from 'ahooks';
import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { useDashboardStore } from '../../../../frames/app/models/dashboard-store-context';
import { EditVersionInfoModal } from './edit-version-info-modal';
import { SwitchOrAddVersion } from './switch-or-add-version';

export const ContentVersionManager = observer(() => {
  const { store } = useDashboardStore();
  const content = store.currentDetail?.content.fullData;
  const [reloadOptionsTrigger, setReloadOptionsTrigger] = useState(1);
  const [opened, { setTrue, setFalse }] = useBoolean(false);

  if (!content) {
    return null;
  }

  const dashboardName = store.currentDetail?.name;

  if (!dashboardName) {
    return null;
  }

  return (
    <>
      <EditVersionInfoModal
        opened={opened}
        close={setFalse}
        content={content}
        dashboardName={dashboardName}
        postSubmit={() => setReloadOptionsTrigger((v) => v + 1)}
      />
      <SwitchOrAddVersion openEdit={setTrue} content={content} reloadOptionsTrigger={reloadOptionsTrigger} />
    </>
  );
});
