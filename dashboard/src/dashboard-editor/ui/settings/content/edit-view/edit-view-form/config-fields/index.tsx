import { observer } from 'mobx-react-lite';
import { ViewMetaInstance } from '~/model';
import { ViewDivisionConfigFields } from './config.division';
import { ViewTabsConfigFields } from './config.tabs';
import { ViewModalConfigFields } from './modal';

export const ConfigFields = observer(({ view }: { view: ViewMetaInstance }) => {
  return (
    <>
      <ViewDivisionConfigFields view={view} />
      <ViewModalConfigFields view={view} />
      <ViewTabsConfigFields view={view} />
    </>
  );
});
