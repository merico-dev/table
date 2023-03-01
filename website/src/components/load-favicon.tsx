import { useRequest } from 'ahooks';
import { Helmet } from 'react-helmet-async';
import { WebsiteAPI } from '../api-caller/website';

export const LoadFavicon = () => {
  const { data } = useRequest(WebsiteAPI.getAll);
  if (!data?.WEBSITE_FAVICON_URL) {
    return null;
  }
  return (
    <Helmet>
      <link id="favicon" rel="icon" href={data.WEBSITE_FAVICON_URL} type="image/svg+xml" />
    </Helmet>
  );
};
