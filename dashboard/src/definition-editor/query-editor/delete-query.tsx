import { ActionIcon, Tooltip } from '@mantine/core';
import { IconTrash } from '@tabler/icons';
import { observer } from 'mobx-react-lite';
import { useModelContext } from '~/contexts';
import { QueryModelInstance } from '~/model';

export interface IDeleteQueryProps {
  queryModel: QueryModelInstance;
}

const _DeleteQuery = (props: IDeleteQueryProps) => {
  const { queryModel } = props;
  const dashboardModel = useModelContext();
  const dependingPanels = dashboardModel.findDependingPanels(queryModel.id);
  const disabled = dependingPanels.length > 0;
  const button = (
    <ActionIcon
      color="red"
      size="sm"
      disabled={disabled}
      onClick={() => dashboardModel.queries.removeQuery(queryModel.id)}
    >
      <IconTrash />
    </ActionIcon>
  );
  if (disabled) {
    return (
      <Tooltip
        label={`This query is used in the following panels: ${dependingPanels.join(', ')}`}
        withArrow
        events={{ hover: true, focus: false, touch: false }}
      >
        <span>{button}</span>
      </Tooltip>
    );
  }
  return button;
};

export const DeleteQuery = observer(_DeleteQuery);
