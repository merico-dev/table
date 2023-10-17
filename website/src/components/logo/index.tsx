import { useRequest } from 'ahooks';
import { ConfigAPI } from '../../api-caller/config';
import { LogoLink } from './logo-link';

export const Logo = () => {
  const { data } = useRequest(ConfigAPI.getWebsiteSettings);
  if (!data) {
    return null;
  }

  return <LogoLink data={data} />;
};
