import { Box } from '@mantine/core';
import { ILoginResp } from '../../api-caller/account.typed';
import { withEntry } from '../../components';
import { defaultStyles, IStyles } from '../styles';
import { LoginForm } from './form';

type Props = {
  styles?: IStyles;
  onSuccess: (resp: ILoginResp) => void;
};

export const Login = withEntry<Props>('Login', ({ styles = defaultStyles, onSuccess }: Props) => {
  return (
    <>
      <Box mt={styles.spacing} sx={{ position: 'relative' }}>
        <LoginForm styles={styles} postSubmit={onSuccess} />
      </Box>
    </>
  );
});
