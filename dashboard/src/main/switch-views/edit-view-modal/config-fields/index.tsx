import { observer } from 'mobx-react-lite';
import { ViewDivisionConfigFields } from './config.division';
import { ViewModalConfigFields } from './config.modal';

export const ConfigFields = observer(() => {
  return (
    <>
      <ViewDivisionConfigFields />
      <ViewModalConfigFields />
    </>
  );
});
