import { Alert, Box } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import { Trans } from 'react-i18next';
import { IStyles, defaultStyles } from '../styles';

interface IDBPermissionTips {
  styles?: IStyles;
}

export function DBPermissionTips({ styles = defaultStyles }: IDBPermissionTips) {
  return (
    <Box mx="auto">
      <Alert mt={styles.spacing} icon={<IconAlertCircle size={16} />}>
        <Trans i18nKey="datasource.db.permission_tip">
          Only <b>SELECT</b> privilege is needed.
        </Trans>
      </Alert>
    </Box>
  );
}
