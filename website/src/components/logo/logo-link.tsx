import { Text } from '@mantine/core';
import { WebsiteSettingsType } from '../../api-caller/config';

const getLang = () => {
  try {
    return navigator.language.startsWith('zh') ? 'zh' : 'en';
  } catch (error) {
    return 'zh';
  }
};

export const LogoLink = ({ data }: { data: WebsiteSettingsType }) => {
  const logo = {
    zh: data.WEBSITE_LOGO_URL_ZH,
    en: data.WEBSITE_LOGO_URL_EN,
  };
  if (!logo.zh && !logo.en) {
    return (
      <Text size={20} sx={{ cursor: 'default', userSelect: 'none' }}>
        @devtable
      </Text>
    );
  }

  const lang = getLang();
  const href = data.WEBSITE_LOGO_JUMP_URL;
  if (!href) {
    return <img src={logo[lang]} />;
  }

  return (
    <a href={href}>
      <img src={logo[lang]} />
    </a>
  );
};
