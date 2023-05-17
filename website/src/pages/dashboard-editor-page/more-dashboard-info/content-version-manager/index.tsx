import { useBoolean } from 'ahooks';
import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { useDashboardStore } from '../../../../frames/app/models/dashboard-store-context';
import { EditVersionInfoModal } from './edit-version-info-modal';
import { SwitchOrAddVersion } from './switch-or-add-version';
import { DashboardChangelogModal } from '../dashboard-changlog-modal';
import { useModalStates } from '../use-modal-states';

export const ContentVersionManager = observer(() => {
  const { store } = useDashboardStore();
  const content = store.currentDetail?.content.fullData;
  const [reloadOptionsTrigger, setReloadOptionsTrigger] = useState(1);
  const states = useModalStates();

  if (!content) {
    return null;
  }

  const dashboardName = store.currentDetail?.name;

  if (!dashboardName) {
    return null;
  }

  return (
    <>
      <DashboardChangelogModal state={states.changelog} />
      <EditVersionInfoModal
        opened={states.version.opened}
        close={states.version.close}
        content={content}
        dashboardName={dashboardName}
        postSubmit={() => setReloadOptionsTrigger((v) => v + 1)}
      />
      <SwitchOrAddVersion content={content} reloadOptionsTrigger={reloadOptionsTrigger} states={states} />
    </>
  );
});
