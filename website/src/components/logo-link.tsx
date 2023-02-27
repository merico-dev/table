const getLang = () => {
  try {
    return navigator.language.startsWith('zh') ? 'zh' : 'en';
  } catch (error) {
    return 'zh';
  }
};
const logo = {
  zh: import.meta.env.VITE_WEBSITE_LOGO_URL_ZH,
  en: import.meta.env.VITE_WEBSITE_LOGO_URL_EN,
};

export const LogoLink = () => {
  const lang = getLang();
  return (
    <a href={import.meta.env.VITE_WEBSITE_LOGO_JUMP_URL}>
      <img src={logo[lang]} />
    </a>
  );
};
