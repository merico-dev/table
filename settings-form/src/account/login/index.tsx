import { Box } from '@mantine/core';
import { ILoginResp } from '../../api-caller/account.typed';
import { configureAPIClient } from '../../api-caller/request';
import { defaultStyles, IStyles } from '../styles';
import { LoginForm } from './form';

interface ILogin {
  styles?: IStyles;
  config: ISettingsFormConfig;
  onSuccess: (resp: ILoginResp) => void;
}

export function Login({ styles = defaultStyles, config, onSuccess }: ILogin) {
  configureAPIClient(config);

  return (
    <>
      <Box mt={styles.spacing} sx={{ position: 'relative' }}>
        <LoginForm styles={styles} postSubmit={onSuccess} />
      </Box>
    </>
  );
}
