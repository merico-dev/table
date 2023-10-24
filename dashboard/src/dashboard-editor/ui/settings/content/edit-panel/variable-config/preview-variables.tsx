import { Prism } from '@mantine/prism';
import { observer } from 'mobx-react-lite';
import { useEditPanelContext } from '~/contexts';

export const PreviewVariables = observer(() => {
  const { panel } = useEditPanelContext();

  if (Object.keys(panel.variableStrings).length === 0) {
    return null;
  }

  return (
    <Prism mt={22} language="json" colorScheme="dark" noCopy>
      {JSON.stringify(panel.variableStrings, null, 4)}
    </Prism>
  );
});
