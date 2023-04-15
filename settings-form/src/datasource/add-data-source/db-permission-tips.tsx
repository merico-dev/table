import { Alert, Box } from '@mantine/core';
import { IStyles, defaultStyles } from '../styles';
import { AlertCircle } from 'tabler-icons-react';

interface IDBPermissionTips {
  styles?: IStyles;
}

export function DBPermissionTips({ styles = defaultStyles }: IDBPermissionTips) {
  return (
    <Box mx="auto">
      <Alert mt={styles.spacing} icon={<AlertCircle size={16} />}>
        Only <b>SELECT</b> privilege is needed.
      </Alert>
    </Box>
  );
}
