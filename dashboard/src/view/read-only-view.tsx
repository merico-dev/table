import { observer } from 'mobx-react-lite';
import { ViewModelInstance } from '..';
import { ReadOnlyDashboardLayout } from './layout';

interface IReadOnlyDashboardView {
  view: ViewModelInstance;
}

export const ReadOnlyDashboardView = observer(function _DashboardLayout({ view }: IReadOnlyDashboardView) {
  return <ReadOnlyDashboardLayout view={view} />;
});
