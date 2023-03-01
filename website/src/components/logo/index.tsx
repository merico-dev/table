import { useRequest } from 'ahooks';
import { WebsiteAPI } from '../../api-caller/website';
import { LogoLink } from './logo-link';

export const Logo = () => {
  const { data } = useRequest(WebsiteAPI.getAll);
  if (!data) {
    return null;
  }

  return (
    <>
      <LogoLink data={data} />
    </>
  );
};
