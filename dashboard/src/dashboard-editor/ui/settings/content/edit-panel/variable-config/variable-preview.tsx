import { Group, Paper } from '@mantine/core';
import { observer } from 'mobx-react-lite';

import { ITemplateVariable, variable2Jsx } from '~/utils/template';

export const VariablePreview = observer(({ variable, data }: { variable: ITemplateVariable; data: TPanelData }) => (
  <Paper withBorder p="md" sx={{ width: '100%' }}>
    {variable2Jsx(variable, data)}
  </Paper>
));
