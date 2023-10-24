import { Prism } from '@mantine/prism';
import { observer } from 'mobx-react-lite';
import { useMemo } from 'react';
import { useEditPanelContext } from '~/contexts';
import { variablesToStrings } from '~/utils/template';

export const PreviewVariables = observer(() => {
  const { panel } = useEditPanelContext();
  const variables = useMemo(() => {
    return variablesToStrings(panel.variables, panel.data);
  }, [panel.variables]);
  return (
    <Prism mt={22} language="json" colorScheme="dark" noCopy>
      {JSON.stringify(variables, null, 4)}
    </Prism>
  );
});
