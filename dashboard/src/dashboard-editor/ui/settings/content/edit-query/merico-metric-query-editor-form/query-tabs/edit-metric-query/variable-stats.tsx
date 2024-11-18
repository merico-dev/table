import { ThemeIcon } from '@mantine/core';
import { IconPointFilled } from '@tabler/icons-react';
import _ from 'lodash';
import { observer } from 'mobx-react-lite';
import { useEditDashboardContext } from '~/contexts';

export const VariableStat = observer(({ variable }: { variable: string | null }) => {
  const model = useEditDashboardContext();
  if (!variable) {
    return null;
  }

  const valid = _.has(model.queryVariables, variable);
  return (
    <ThemeIcon
      variant="white"
      size="xs"
      color={valid ? '#88CE98' : '#F15050'}
      styles={{ root: { flexGrow: 0, flexShrink: 0 } }}
    >
      <IconPointFilled />
    </ThemeIcon>
  );
});
