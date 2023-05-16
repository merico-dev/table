import { observer } from 'mobx-react-lite';
import { TModalStates } from './types';
import { DashboardChangelogModalTrigger } from './dashboard-changlog-modal/changelog-modal-trigger';
import { Menu } from '@mantine/core';

interface IProps {
  states: TModalStates;
}

export const DashboardHeaderMenuItems = observer(({ states }: IProps) => {
  return (
    <>
      <Menu.Divider />
      <DashboardChangelogModalTrigger state={states.changelog} />
    </>
  );
});
