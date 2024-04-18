import { Alert, Box } from '@mantine/core';
import { IStyles, defaultStyles } from '../styles';
import { AlertCircle } from 'tabler-icons-react';
import { Trans, useTranslation } from 'react-i18next';

interface IDBPermissionTips {
  styles?: IStyles;
}

export function DBPermissionTips({ styles = defaultStyles }: IDBPermissionTips) {
  const { t } = useTranslation();
  return (
    <Box mx="auto">
      <Alert mt={styles.spacing} icon={<AlertCircle size={16} />}>
        <Trans i18nKey="datasource.db.permission_tip">
          Only <b>SELECT</b> privilege is needed.
        </Trans>
      </Alert>
    </Box>
  );
}
