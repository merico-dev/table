import { Group, Paper } from '@mantine/core';
import { observer } from 'mobx-react-lite';

import { ITemplateVariable, variable2Jsx } from '~/utils/template';

export const VariablePreview = observer(({ variable, data }: { variable: ITemplateVariable; data: TPanelData }) => (
  <Group style={{ minHeight: 0, height: 'calc(100% - 68px)' }}>
    <Paper withBorder p="md">
      {variable2Jsx(variable, data)}
    </Paper>
  </Group>
));
