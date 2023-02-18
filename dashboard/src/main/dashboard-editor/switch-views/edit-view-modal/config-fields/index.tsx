import { observer } from 'mobx-react-lite';
import { ViewDivisionConfigFields } from './config.division';
import { ViewTabsConfigFields } from './config.tabs';
import { ViewModalConfigFields } from './modal';

export const ConfigFields = observer(() => {
  return (
    <>
      <ViewDivisionConfigFields />
      <ViewModalConfigFields />
      <ViewTabsConfigFields />
    </>
  );
});
