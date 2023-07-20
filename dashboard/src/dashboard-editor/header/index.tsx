import { observer } from 'mobx-react-lite';
import { IDashbaordEditorHeaderMain, MainHeader } from './main-header';
import { SubHeader } from './sub-header';

interface IDashboardEditorHeader extends IDashbaordEditorHeaderMain {
  [key: string]: any;
}

export const DashboardEditorHeader = observer((props: IDashboardEditorHeader) => {
  return (
    <>
      <MainHeader {...props} />
      <SubHeader />
    </>
  );
});
