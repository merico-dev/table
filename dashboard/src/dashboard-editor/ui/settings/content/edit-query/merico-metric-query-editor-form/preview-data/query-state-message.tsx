import { Text } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { QueryModelInstance } from '~/dashboard-editor/model';

type Props = {
  queryModel: QueryModelInstance;
};
export const QueryStateMessage = observer(({ queryModel }: Props) => {
  const { t } = useTranslation();
  const { state, error, metricQueryPayloadErrorString, stateMessage } = queryModel;
  if (state === 'loading') {
    return null;
  }
  if (!!error) {
    return (
      <Text mt={10} c="red" size="md" ta="center" ff="monospace">
        {error}
      </Text>
    );
  }
  if (!!metricQueryPayloadErrorString) {
    return (
      <Text mt={10} c="red" size="md" ta="center" ff="monospace">
        {metricQueryPayloadErrorString}
      </Text>
    );
  }
  if (!!stateMessage) {
    return (
      <Text size="sm" mt={10} c="gray" ta="center">
        {t(stateMessage)}
      </Text>
    );
  }

  return null;
});
