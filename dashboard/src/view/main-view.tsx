import { observer } from 'mobx-react-lite';
import { ViewModelInstance } from '..';
import { MainDashboardLayout } from './layout';

interface IMainDashboardView {
  view: ViewModelInstance;
}

export const MainDashboardView = observer(function _MainDashboardView({ view }: IMainDashboardView) {
  return <MainDashboardLayout view={view} isDraggable isResizable />;
});
