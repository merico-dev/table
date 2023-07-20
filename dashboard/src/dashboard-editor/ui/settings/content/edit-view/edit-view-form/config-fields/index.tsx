import { observer } from 'mobx-react-lite';
import { ViewModelInstance } from '~/dashboard-editor/model';
import { ViewDivisionConfigFields } from './config.division';
import { ViewTabsConfigFields } from './config.tabs';
import { ViewModalConfigFields } from './modal';

export const ConfigFields = observer(({ view }: { view: ViewModelInstance }) => {
  return (
    <>
      <ViewDivisionConfigFields view={view} />
      <ViewModalConfigFields view={view} />
      <ViewTabsConfigFields view={view} />
    </>
  );
});
